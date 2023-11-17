import React, {useEffect, useState} from 'react';
import {Button, Col, Input, message, Modal, Popconfirm, Row, Table} from "antd";
import {useRecoilState} from "recoil";
import {
    adsListAtom, adsListMapAtom,
    filteredDataAtom, mappingRefreshCountAtom,
    selectedAdsListAtom,
    selectedCategoryAtom
} from "@/stores/mapping/mapping-ads-store";
import {axiosGet, axiosPost} from "@/utils/axios";

const MappingModal = ({isModalOpen, setIsModalOpen, handleOk, handleCancel}) => {
    const [selectedRowKeys, setSelectedRowKeys] = useRecoilState(selectedAdsListAtom);
    const [adsList, setAdsList] = useRecoilState(adsListAtom);
    const [filteredData, setFilteredData] = useRecoilState(filteredDataAtom);
    const [selectedCategoryIds, setSelectedCategoryIds] = useRecoilState(selectedCategoryAtom);
    const [adsListMap, setAdsListMap] = useRecoilState(adsListMapAtom);
    const [searchValue, setSearchValue] = useState('');
    const [refreshCount, setRefreshCount] = useRecoilState(mappingRefreshCountAtom);
    const [successFlag, setSuccessFlag] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    useEffect(() => {
        //
    }, [selectedCategoryIds, selectedRowKeys]);


    useEffect(() => {
        if (isModalOpen) {
            (async () => {
                await getAreaLists();
            })()
        }
    }, [isModalOpen]);


    const columns = [
        {
            title: '', dataIndex: 'key',
        },
        {
            title: 'area_idx', dataIndex: 'area_idx',
        },
        {
            title: 'area_name', dataIndex: 'area_name',
        },
        {
            title: 'origin_areacd', dataIndex: 'origin_areacd',
        }
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }

    const mappingAreaToCategory = async () => {
        for (let i = 0; i < selectedCategoryIds.length; i++) {
            for (let j = 0; j < selectedRowKeys.length; j++) {
                try {
                    await axiosPost(`/area`, {
                        category_id: selectedCategoryIds[i].id,
                        origin_area_idx: adsListMap.get(selectedRowKeys[j]).origin_areacd
                    })
                } catch (e) {
                    message.error('매핑에 실패하였습니다');
                } finally {
                    setSuccessFlag(true);
                    setSelectedRowKeys(undefined);
                }
            }
        }
        setRefreshCount((prev) => prev + 1);
    }

    useEffect(() => {
        if (successFlag) {
            message.success('매핑에 성공하였습니다.');
            setIsModalOpen(false);
        }
    }, [successFlag]);

    const getAreaLists = async () => {
        try {
            setLoading(true);
            const res = await axiosGet('/area');
            await getHashMap(res.data);
        } catch (e) {
            message.error(e.message);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    const getHashMap = (data) => {
        const response = data.map((i, index) => {
            return {
                key: index + 1, ...i
            }
        })
        setAdsList([...response]);

        const temp = new Map();
        response?.forEach((i) => {
            temp.set(i.key, i)
        })
        setAdsListMap(temp);
    }

    useEffect(() => {
        // console.log(`adsListMap = `, adsListMap);
    }, [adsListMap]);

    useEffect(() => {
        if (searchValue !== '') {
            const result = adsList.filter((elem) => {
                return (elem.area_name.includes(searchValue) === true);
            });
            setFilteredData(result);
        } else {
            setFilteredData(undefined);
        }
    }, [searchValue]);

    return (
        <Modal title="영역 매핑" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={1100}>
            {loading ? (
                <div>
                    로딩중...
                </div>
            ) : (
                <>
                    <Row justify={'space-between'}>
                        <Col span={14}>
                            <Input value={searchValue} onChange={(e) => setSearchValue(e.target.value)}
                                   placeholder={"영역명 검색"}/>
                        </Col>
                        <Col>
                            <Button onClick={mappingAreaToCategory} type={"primary"}>매핑</Button>
                        </Col>

                    </Row>
                    <div>
                        <Table
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={filteredData || adsList}/>
                    </div>
                </>
            )}

        </Modal>
    )
}

export default MappingModal
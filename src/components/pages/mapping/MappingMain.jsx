import React, {useEffect, useState} from 'react';
import {Button, Card, Checkbox, Col, Input, message, Popconfirm, Row, Table} from "antd";
import {useRecoilState} from "recoil";
import {
    addCategoryRefreshCountAtom,
    adsListAtom, adsListMapAtom,
    filteredDataAtom, mappingRefreshCountAtom, searchListMapAtom,
    selectedAdsListAtom,
    selectedCategoryAtom, selectedDeleteAdsListAtom
} from "@/stores/mapping/mapping-ads-store";
import MappingModal from "@/components/pages/mapping/MappingModal";
import CategoryModal from "@/components/pages/mapping/CategoryModal";
import {axiosDelete, axiosGet, axiosPost} from "@/utils/axios";
import axios from "axios";

const MappingMain = () => {

    const [count, setCount] = useState(0);
    const [selectedRowKeys, setSelectedRowKeys] = useRecoilState(selectedDeleteAdsListAtom);
    const [adsList, setAdsList] = useRecoilState(adsListAtom);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCateModalOpen, setIsCateModalOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [filteredData, setFilteredData] = useRecoilState(filteredDataAtom);
    const {Search} = Input;
    const [categoryData, setCategoryData] = useState(undefined);
    const [selectedCategoryIds, setSelectedCategoryIds] = useRecoilState(selectedCategoryAtom);
    const [mappingSearchData, setMappingSearchData] = useState(undefined);
    const [refreshCount, setRefreshCount] = useRecoilState(mappingRefreshCountAtom);
    const [unMappingCount, setUnMappingCount] = useState(0);
    const [searchListMap, setSearchListMap] = useRecoilState(searchListMapAtom);
    const [updateSuccessFlag, setUpdateSuccessFlag] = useState(false);
    const [addCateRefreshCount, setAddCateRefreshCount] = useRecoilState(addCategoryRefreshCountAtom);
    const [deleteCateFlag, setDeleteCateFlag] = useState(false);

    const onSelectChange = (newSelectedRowKeys) => {
        // console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const showCateModal = () => {
        setIsCateModalOpen(true);
    }

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCateOk = () => {
        setIsCateModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleCateCancel = () => {
        setIsCateModalOpen(false);
    }

    useEffect(() => {
        if (searchValue !== '') {
            const result = mappingSearchData.filter((elem) => {
                return (elem.area_name.includes(searchValue) === true);
            });
            setFilteredData(result);
        } else {
            setFilteredData(undefined);
        }
    }, [searchValue]);

    useEffect(() => {
        //
    }, [count])

    useEffect(() => {
        if (updateSuccessFlag) {
            message.success('해제에 성공하였습니다.');
        }
    }, [updateSuccessFlag]);


    const columns = [
        {
            title: '카테고리명', dataIndex: 'category_name',
        },
        {
            title: '영역명', dataIndex: 'area_name',
        },
        {
            title: 'origin_idx', dataIndex: 'origin_area_idx',
        },
        {
            title: '등록일', dataIndex: 'register_date',
            render: (data) => {
                return (
                    <div>
                        {data.split('T')[0]}
                    </div>
                )
            }
        }
    ];

    useEffect(() => {
        (async () => {
            await getCategoryData();
        })()
    }, [addCateRefreshCount, deleteCateFlag]);

    const getCategoryData = async () => {
        try {
            const res = await axiosGet('/category');
            // console.log(`cate res = `, res);
            setCategoryData(res.data);
        } catch (e) {
            message.error(e.message);
        }
    }

    const handleCheckboxChange = (categoryId, isChecked) => {
        // console.log(`selectedCategoryIds = `, selectedCategoryIds);
        if (selectedCategoryIds.map((data) => data.id).includes(categoryId.id)) {
            setSelectedCategoryIds(selectedCategoryIds.filter(data => data.id !== categoryId.id));
        } else {
            setSelectedCategoryIds([...selectedCategoryIds, {...categoryId}]);
        }

    };

    useEffect(() => {
        // console.log(`selectedCagte = `, selectedCategoryIds);
    }, [selectedCategoryIds])

    const searchLists = async () => {

        const idArr = [];
        selectedCategoryIds.map((i) => idArr.push(i.id));

        if (selectedCategoryIds.length > 0) {
            const res = await axiosGet(`/area/mapping?id=${idArr.join(',')}`);
            console.log(`search res = `, res);
            await getHashMap(res.data);
            // setMappingSearchData(res.data);
        }
    }

    useEffect(() => {
        (async () => {
            await searchLists();
        })()
    }, [unMappingCount, refreshCount])


    const getHashMap = (data) => {
        const response = data.map((i, index) => {
            return {
                key: index + 1, ...i
            }
        })
        setMappingSearchData([...response]);

        const temp = new Map();
        response?.forEach((i) => {
            temp.set(i.key, i)
        })
        setSearchListMap(temp);
    }

    const unMappingAreaToCategory = async () => {
        for (let i = 0; i < selectedCategoryIds.length; i++) {
            for (let j = 0; j < selectedRowKeys.length; j++) {
                try {
                    await axiosDelete(`/area/delete`, {
                        data: {
                            category_id: selectedCategoryIds[i].id,
                            origin_area_idx: searchListMap.get(selectedRowKeys[j]).origin_area_idx
                        }
                    })
                } catch (e) {
                    message.error('해제에 실패하였습니다');
                } finally {
                    setUpdateSuccessFlag(true);
                }
            }
        }
        setSelectedRowKeys(undefined);
        setUnMappingCount((prev) => prev + 1);
        setUpdateSuccessFlag(false);
    }


    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }

    const cancel = (e) => {
        console.log(e);
        message.error('Click on No');
    };

    const deleteCategory = async () => {
        // const res = await axiosDelete();
        console.log(`selectedCateIds = `, selectedCategoryIds);
        for (let i = 0; i < selectedCategoryIds.length; i++) {
            try {
                await axiosDelete(`/category/delete`, {
                    data: {
                        categoryId: selectedCategoryIds[i].id
                    }
                })
            } catch (e) {
                message.error('카테고리 삭제에 실패했습니다.');
            } finally {
                message.success('카테고리 삭제');
                setDeleteCateFlag(true);
            }
        }

    }

    return (
        <>
            <Row gutter={[10, 10]} className={'mapping-main-container'} justify={'space-evenly'}>
                <Col span={6}>

                    <Row justify={'space-between'}>
                        <Col>
                            <div className={'category-list-title'}>
                                카테고리 리스트
                            </div>
                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    <Button onClick={searchLists} type={'primary'}>검색</Button>
                                </Col>
                                <Col>
                                    <Button onClick={showCateModal} type={'primary'}>추가</Button>
                                </Col>
                                <Popconfirm
                                    title="Delete the task"
                                    description="Are you sure to delete this task?"
                                    onConfirm={deleteCategory}
                                    onCancel={cancel}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Col>
                                        <Button type={'danger'}>삭제</Button>
                                    </Col>
                                </Popconfirm>
                            </Row>
                        </Col>
                    </Row>

                    {categoryData?.map((i, index) => (
                        <Card key={i.id}>
                            <Row justify={'space-between'}>
                                <Col>
                                    <h1>{i.name}</h1>
                                </Col>
                                <Col>
                                    <Checkbox
                                        onChange={(e) => handleCheckboxChange(i, e.target.checked)}
                                        checked={selectedCategoryIds?.map((data) => data.id).includes(i.id)}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </Col>
                <Col span={17}>

                    <Row justify={'space-between'}>
                        <Col>
                            <div className={'category-list-title'}>
                                카테고리 영역 리스트
                            </div>
                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    <Input placeholder={'검색할 영역이름'} value={searchValue}
                                           onChange={(e) => setSearchValue(e.target.value)}/>
                                </Col>
                                <Col>
                                    <Button onClick={showModal} type={'primary'}>세팅</Button>
                                    {/*<Button onClick={mappingCateArea} type={'primary'}>매핑</Button>*/}
                                </Col>
                                <Popconfirm
                                    title="Delete the task"
                                    description="Are you sure to delete this task?"
                                    onConfirm={unMappingAreaToCategory}
                                    onCancel={cancel}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Col>
                                        <Button type={"danger"}>해제</Button>
                                    </Col>
                                </Popconfirm>
                            </Row>
                        </Col>

                    </Row>

                    {mappingSearchData ? (
                        <Table
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={filteredData || mappingSearchData}/>
                    ) : (
                        <div>
                            선택된 데이터가 없습니다.
                        </div>
                    )}


                </Col>
            </Row>

            <MappingModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} handleOk={handleOk}
                          handleCancel={handleCancel}/>

            <CategoryModal isModalOpen={isCateModalOpen} setIsModalOpen={setIsCateModalOpen} handleOk={handleCateOk}
                           handleCancel={handleCateCancel}/>

        </>
    )


}

export default MappingMain;
import React, {useEffect, useState} from 'react';
import {Table} from "antd";
import {axiosGet} from "@/utils/axios";
import {useRecoilState} from "recoil";
import {adsListAtom} from "@/stores/mapping/mapping-ads-store";

const Test = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [adsList, setAdsList] = useRecoilState(adsListAtom);
    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    // const columns = [
    //     {
    //         title: 'Name',
    //         dataIndex: 'name',
    //     },
    //     {
    //         title: 'Age',
    //         dataIndex: 'age',
    //     },
    //     {
    //         title: 'Address',
    //         dataIndex: 'address',
    //     },
    // ];

    useEffect(() => {
        (async () => {
            await getAreaLists();
        })()
    }, [])

    const getAreaLists = async () => {
        const res = await axiosGet('/area');
        console.log(`area res = `, res);
        setAdsList(res.data.map((i, index) => {
            return {
                key: index + 1, ...i
            }
        }));
    }

    const columns = [
        {
            title: '#', dataIndex: 'key'
        },
        {
            title: 'area_idx', dataIndex: 'area_idx',
        },
        {
            title: 'area_name', dataIndex: 'area_name',
        },
        {
            title: 'site_idx', dataIndex: 'site_idx',
        }
    ];

    const rowSelection = {
        selectedRowKeys, onChange: onSelectChange
    };
    return <Table rowSelection={rowSelection} columns={columns} dataSource={adsList}/>;
}

export default Test;
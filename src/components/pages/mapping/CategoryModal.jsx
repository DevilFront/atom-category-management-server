import React, {useEffect, useState} from 'react'
import {Button, Col, Input, message, Modal, Row} from "antd";
import {axiosGet, axiosPost} from "@/utils/axios";
import {useRecoilState} from "recoil";
import {addCategoryRefreshCountAtom} from "@/stores/mapping/mapping-ads-store";

const CategoryModal = ({isModalOpen, setIsModalOpen, handleOk, handleCancel}) => {

    const [inputValue, setInputValue] = useState('');
    const [addCateRefreshCount, setAddCateRefreshCount] = useRecoilState(addCategoryRefreshCountAtom);

    const addCategory = async () => {
        try {
            const res = await axiosPost('/category', {
                name: inputValue
            })
        } catch (e) {
            message.error('카테고리 추가에 실패하였습니다.')
        } finally {
            message.success('카테고리 생성에 성공했습니다.');
            setAddCateRefreshCount((prev) => prev + 1)
        }

    }

    useEffect(() => {
        console.log(`inputValue = `, inputValue);
    }, [inputValue])


    return (
        <Modal title="영역 매핑" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={700}>
            <Row justify={'space-between'}>
                <Col span={20}>
                    <Input placeholder={'생성할 카테고리명'} value={inputValue}
                           onChange={(e) => setInputValue(e.target.value)}/>
                </Col>
                <Col span={4}>
                    <Button type={"primary"} onClick={addCategory}>확인</Button>
                </Col>
            </Row>
        </Modal>
    )
}

export default CategoryModal;
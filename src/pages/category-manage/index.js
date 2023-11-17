import React from 'react';
import BasicLayout from "@/layout/BasicLayout";
import CategoryMain from "@/components/pages/category-manage/CategoryMain";

const CategoryPage = () => {
    return (
        <BasicLayout pageName={'카테고리 관리'}>
            <CategoryMain/>
        </BasicLayout>
    )
}

export default CategoryPage;
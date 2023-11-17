import React from 'react';
import BasicLayout from "@/layout/BasicLayout";
import MappingMain from "@/components/pages/mapping/MappingMain";

const MappingPage = () => {
    return (
        <BasicLayout pageName={'영역 매핑'}>
            <MappingMain />
        </BasicLayout>
    )
}

export default MappingPage;
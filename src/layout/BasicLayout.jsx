import React, {useEffect} from 'react';
import {Avatar, Layout, Menu} from "antd";
import {HomeOutlined, TeamOutlined, UserOutlined} from "@ant-design/icons";
import {useRecoilState} from "recoil";
import {layoutCollapsedState} from "@/stores/layout/layout-value-store";
import {useRouter} from 'next/router';
import {mappingAdsListAtom} from "@/stores/mapping/mapping-ads-store";

const BasicLayout = ({pageName, children}) => {

    const router = useRouter();
    const {SubMenu} = Menu;
    const {
        Header,
        Content,
        Footer,
        Sider,
    } = Layout;

    const [collapsed, setCollapsed] = useRecoilState(layoutCollapsedState);


    const onCollapse = (collapsed, type) => {
        setCollapsed(collapsed);
    };

    useEffect(() => {
        console.log(`collapse = `, collapsed);
    }, [collapsed]);

    const onClickRouter = async (e) => {
        await router.push(`/${e.key}`);
    };


    return (
        <>
            <Layout className={'layout-container'}>
                <Sider
                    width={170}
                    collapsible
                    collapsed={collapsed}
                    onCollapse={onCollapse}
                >
                    <div className={'sidebar-logo'}>
                        {collapsed ? 'AC' : 'A-Compass'}
                    </div>
                    <Menu
                        theme="dark"
                        mode="inline"
                        onClick={onClickRouter}
                    >
                        <Menu.Item key="mapping" icon={<HomeOutlined/>}>
                            영역 관리
                        </Menu.Item>
                    </Menu>
                </Sider>

                <div className={'right-section'}>
                    <div className={'header'}>
                        <div className={'header-user'}>
                            <Avatar className={'user-logo'} icon={<UserOutlined/>}/>
                            {/*<div className={'user-name'}>*/}
                            {/*    정상훈*/}
                            {/*</div>*/}
                        </div>
                    </div>
                    <div className='content-section'>
                        <div className={'layout-pagename'}>
                            {pageName}
                        </div>
                        {children}
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default BasicLayout
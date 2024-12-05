import { usePageData } from 'rspress/runtime';
import Theme from 'rspress/theme';
import Archives from './components/Archives';
import BottomTitle from './components/BottomTitle';
import Main from './components/Main';
import Tags from './components/Tags';

import { Fragment } from 'react';

import { getCustomMDXComponent as getRspressMDXComponent } from 'rspress/theme';

const Layout = () => {
    const { page } = usePageData();
    const { frontmatter } = page;

    if (frontmatter.layout === 'main') {
        return (
            <Theme.Layout
                beforeOutline={<Tags />}
                components={{ wrapper: Main }}
            />
        );
    }

    if (frontmatter.layout === 'archives') {
        return <Theme.Layout components={{ wrapper: Archives }} />;
    }
    return <Theme.Layout />;
};

export default {
    ...Theme,
    Layout,
};

export const getCustomMDXComponent = (): any => {
    const CustomMDXComponent = getRspressMDXComponent();

    return {
        ...CustomMDXComponent,
        h1: (props: any) => {
            const { page } = usePageData();
            const { frontmatter } = page;
            return (
                <Fragment>
                    <CustomMDXComponent.h1 {...props} />
                    {frontmatter?.layout === 'article' && <BottomTitle />}
                </Fragment>
            );
        },
    };
};

export * from 'rspress/theme';

import { Fragment } from 'react';
import { usePageData } from 'rspress/runtime';
import Theme, {
    getCustomMDXComponent as getRspressMDXComponent,
} from 'rspress/theme';
import Archives from './components/Archives';
import BottomTitle from './components/BottomTitle';
import Footer from './components/Footer';
import GiscusComment from './components/Giscus';
import Main from './components/Main';
import Tags from './components/Tags';

const Layout = () => {
    const { page } = usePageData();
    const { frontmatter } = page;

    const commonProps = {
        bottom: <Footer />,
    };

    if (frontmatter.layout === 'main') {
        return (
            <Theme.Layout
                {...commonProps}
                beforeOutline={<Tags />}
                components={{ wrapper: Main }}
            />
        );
    }

    if (frontmatter.layout === 'archives') {
        return (
            <Theme.Layout {...commonProps} components={{ wrapper: Archives }} />
        );
    }

    return (
        <Theme.Layout
            {...commonProps}
            beforeDocFooter={
                <>{frontmatter?.layout === 'article' && <GiscusComment />}</>
            }
            components={{
                wrapper: ({ children }: { children: React.ReactNode }) => (
                    <div>{children}</div>
                ),
            }}
        />
    );
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

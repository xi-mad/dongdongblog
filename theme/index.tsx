import Theme from 'rspress/theme';
import { usePageData } from 'rspress/runtime';
import Archives from './components/Archives';
import Main from './components/Main';
import Tags from './components/Tags';

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

export * from 'rspress/theme';

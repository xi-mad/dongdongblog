import Theme from 'rspress/theme';
import { usePageData } from 'rspress/runtime';
import Archives from './components/Archives';
import Main from './components/Main';

const Layout = () => {
    const { page } = usePageData();
    const { frontmatter } = page;

    if (frontmatter.layout === 'main') {
        return <Theme.Layout components={{ wrapper: Main }} />;
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

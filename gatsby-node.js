const kebabCase = require(`lodash.kebabcase`);
const withDefaults = require(`./src/@lekoarts/gatsby-theme-minimal-blog-core/utils/default-options`);

const mdxResolverPassthrough = (fieldName) => async (
  source,
  args,
  context,
  info
) => {
  const type = info.schema.getType(`Mdx`);
  const mdxNode = context.nodeModel.getNodeById({
    id: source.parent,
  });
  const resolver = type.getFields()[fieldName].resolve;
  const result = await resolver(mdxNode, args, context, {
    fieldName,
  });
  return result;
};

// Create general interfaces that you could can use to leverage other data sources
// The core theme sets up MDX as a type for the general interface
exports.createSchemaCustomization = ({ actions, schema }, themeOptions) => {
  const { createTypes, createFieldExtension } = actions;

  const { basePath } = withDefaults(themeOptions);

  const slugify = (source) => {
    const slug = source.slug ? source.slug : kebabCase(source.title);

    return `/${basePath}/${slug}`.replace(/\/\/+/g, `/`);
  };
  /*
  createFieldExtension({
    name: `slugify`,
    extend() {
      return {
        resolve: slugify,
      };
    },
  });

  createFieldExtension({
    name: `mdxpassthrough`,
    args: {
      fieldName: `String!`,
    },
    extend({ fieldName }) {
      return {
        resolve: mdxResolverPassthrough(fieldName),
      };
    },
  });
*/
  createTypes(`
    interface Post @nodeInterface {
      id: ID!
      slug: String! @slugify
      title: String!
      date: Date! @dateformat
      excerpt(pruneLength: Int = 160): String!
      body: String!
      html: String
      timeToRead: Int
      tags: [PostTag]
      banner: File @fileByRelativePath
      description: String
      canonicalUrl: String
    }
    type PostTag {
      name: String
      slug: String
    }
    interface Page @nodeInterface {
      id: ID!
      slug: String!
      title: String!
      excerpt(pruneLength: Int = 160): String!
      body: String!
    }

    type MinimalBlogConfig implements Node {
      basePath: String
      blogPath: String
      postsPath: String
      pagesPath: String
      tagsPath: String
      externalLinks: [ExternalLink]
      navigation: [NavigationEntry]
      showLineNumbers: Boolean
      showCopyButton: Boolean
    }
    type ExternalLink {
      name: String!
      url: String!
    }
    type NavigationEntry {
      title: String!
      slug: String!
    }
  `);
};
/*
exports.sourceNodes = ({ actions, createContentDigest }, themeOptions) => {
  const { createNode } = actions;
  const {
    basePath,
    blogPath,
    postsPath,
    pagesPath,
    tagsPath,
    externalLinks,
    navigation,
    showLineNumbers,
    showCopyButton,
  } = withDefaults(themeOptions);

  const minimalBlogConfig = {
    basePath,
    blogPath,
    postsPath,
    pagesPath,
    tagsPath,
    externalLinks,
    navigation,
    showLineNumbers,
    showCopyButton,
  };

  createNode({
    ...minimalBlogConfig,
    id: `@lekoarts/gatsby-theme-minimal-blog-core-config`,
    parent: null,
    children: [],
    internal: {
      type: `MinimalBlogConfig`,
      contentDigest: createContentDigest(minimalBlogConfig),
      content: JSON.stringify(minimalBlogConfig),
      description: `Options for @lekoarts/gatsby-theme-minimal-blog-core`,
    },
  });
};


exports.onCreateNode = (
  { node, actions, getNode, createNodeId, createContentDigest },
  themeOptions
) => {
  const { createNode, createParentChildLink } = actions;

  const { postsPath, pagesPath } = withDefaults(themeOptions);

  // Make sure that it's an MDX node

  if (
    node.internal.type !== `GhostPost` &&
    node.internal.type !== `GhostPage`
  ) {
    return;
  }

  // Create a source field
  // And grab the sourceInstanceName to differentiate the different sources
  // In this case "postsPath" and "pagesPath"
  //const fileNode = getNode(node.parent);
  // const source = fileNode.sourceInstanceName;

  // Check for "posts" and create the "Post" type

  if (node.internal.type === `GhostPost`) {
    let modifiedTags;

    if (node.tags) {
      modifiedTags = node.tags.map((tag) => ({
        name: tag,
        slug: kebabCase(tag),
      }));
    } else {
      modifiedTags = null;
    }

    const fieldData = {
      slug: node.slug ? node.slug : undefined,
      title: node.title,
      date: node.date,
      tags: modifiedTags,
      banner: node.banner,
      description: node.description,
      canonicalUrl: node.canonicalUrl,
    };

    const ghostPostId = createNodeId(`${node.id} >>> GhostPost`);

    createNode({
      ...fieldData,
      // Required fields
      id: ghostPostId,
      parent: node.id,
      children: [],
      internal: {
        type: `GhostPost`,
        contentDigest: createContentDigest(fieldData),
        content: JSON.stringify(fieldData),
        description: `Ghost implementation of the Post interface`,
      },
    });

    createParentChildLink({ parent: node, child: getNode(ghostPostId) });
  }

  // Check for "pages" and create the "Page" type
  if (node.internal.type === `GhostPage`) {
    const fieldData = {
      title: node.title,
      slug: node.slug,
    };

    const ghostPageId = createNodeId(`${node.id} >>> GhostPage`);

    createNode({
      ...fieldData,
      // Required fields
      id: ghostPageId,
      parent: node.id,
      children: [],
      internal: {
        type: `GhostPage`,
        contentDigest: createContentDigest(fieldData),
        content: JSON.stringify(fieldData),
        description: `Ghost implementation of the Page interface`,
      },
    });

    createParentChildLink({ parent: node, child: getNode(ghostPageId) });
  }
};
*/
// These template are only data-fetching wrappers that import components
const homepageTemplate = require.resolve(
  `./src/@lekoarts/gatsby-theme-minimal-blog-core/templates/homepage-query.tsx`
);
const blogTemplate = require.resolve(
  `./src/@lekoarts/gatsby-theme-minimal-blog-core/templates/blog-query.tsx`
);
const postTemplate = require.resolve(
  `./src/@lekoarts/gatsby-theme-minimal-blog-core/templates/post-query.tsx`
);
const pageTemplate = require.resolve(
  `./src/@lekoarts/gatsby-theme-minimal-blog-core/templates/page-query.tsx`
);
const tagTemplate = require.resolve(
  `./src/@lekoarts/gatsby-theme-minimal-blog-core/templates/tag-query.tsx`
);
const tagsTemplate = require.resolve(
  `./src/@lekoarts/gatsby-theme-minimal-blog-core/templates/tags-query.tsx`
);

exports.createPages = async ({ actions, graphql, reporter }, themeOptions) => {
  const { createPage } = actions;

  const {
    basePath,
    blogPath,
    tagsPath,
    formatString,
    postsPrefix,
  } = withDefaults(themeOptions);

  createPage({
    path: basePath,
    component: homepageTemplate,
    context: {
      formatString,
    },
  });

  createPage({
    path: `/${basePath}/${blogPath}`.replace(/\/\/+/g, `/`),
    component: blogTemplate,
    context: {
      formatString,
    },
  });

  createPage({
    path: `/${basePath}/${tagsPath}`.replace(/\/\/+/g, `/`),
    component: tagsTemplate,
  });

  const result = await graphql(`
    query {
      allPost: allGhostPost(sort: { fields: created_at, order: DESC }) {
        nodes {
          slug
        }
      }
      allPage: allGhostPage {
        nodes {
          slug
        }
      }
      tags: allGhostPost(sort: { fields: tags___name, order: DESC }) {
        group(field: tags___name) {
          fieldValue
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your posts or pages`,
      result.errors
    );
    return;
  }

  const posts = result.data.allPost.nodes;
  posts.forEach((post) => {
    createPage({
      path: `/${postsPrefix}/${post.slug}`.replace(/\/\/+/g, `/`),
      // path: `/${post.slug}`,
      component: postTemplate,
      context: {
        slug: post.slug,
        formatString,
      },
    });
  });

  const pages = result.data.allPage.nodes;
  console.table(pages);
  if (pages.length > 0) {
    pages.forEach((page) => {
      createPage({
        path: `/${basePath}/${page.slug}`.replace(/\/\/+/g, `/`),
        component: pageTemplate,
        context: {
          slug: page.slug,
        },
      });
    });
  }

  const tags = result.data.tags.group;

  if (tags.length > 0) {
    tags.forEach((tag) => {
      createPage({
        path: `/${basePath}/${tagsPath}/${kebabCase(tag.fieldValue)}`.replace(
          /\/\/+/g,
          `/`
        ),
        component: tagTemplate,
        context: {
          slug: kebabCase(tag.fieldValue),
          name: tag.fieldValue,
          formatString,
        },
      });
    });
  }
};

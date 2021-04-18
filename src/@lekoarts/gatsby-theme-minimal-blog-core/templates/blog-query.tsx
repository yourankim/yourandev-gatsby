import { graphql } from "gatsby"
import BlogComponent from "@lekoarts/gatsby-theme-minimal-blog-core/src/components/blog"

export default BlogComponent
/*
export const query = graphql`
  query($formatString: String!) {
    allPost(sort: { fields: date, order: DESC }) {
      nodes {
        slug
        title
        date(formatString: $formatString)
        excerpt
        timeToRead
        description
        tags {
          name
          slug
        }
      }
    }
  }
`
*/
export const query = graphql`
  query($formatString: String!) {
    allPost:allGhostPost(sort: { fields: created_at, order: DESC }) {
      nodes {
        slug
        title
        date:created_at(formatString: $formatString)
        excerpt
        timeToRead:reading_time
        description:html
        tags {
          name
          slug
        }
      }
    }
  }
  `
import { graphql } from "gatsby"
import TagComponent from "@lekoarts/gatsby-theme-minimal-blog-core/src/components/tag"

export default TagComponent

export const query = graphql`
  query($slug: String!, $formatString: String!) {
    allPost:allGhostPost(sort: { fields: created_at, order: DESC }, filter: { tags: { elemMatch: { slug: { eq: $slug } } } }) {
      nodes {
        slug
        title
        date:created_at(formatString: $formatString)
        excerpt
        timeToRead:reading_time
        description:plaintext
        tags {
          name
          slug
        }
      }
    }
  }
`
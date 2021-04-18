import { graphql } from "gatsby"
import HomepageComponent from "@lekoarts/gatsby-theme-minimal-blog-core/src/components/homepage"

export default HomepageComponent

export const query = graphql`
  query($formatString: String!) {
    allPost:allGhostPost(sort: { fields: created_at, order: DESC }, limit: 3) {
      nodes {
        slug
        title
        date:created_at(formatString: $formatString)
        excerpt
        timeToRead:reading_time
        html
        tags {
          name
          slug
        }
      }
    }
  }
`
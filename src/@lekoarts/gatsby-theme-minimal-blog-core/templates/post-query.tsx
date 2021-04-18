import { graphql } from "gatsby"
import PostComponent from "@lekoarts/gatsby-theme-minimal-blog-core/src/components/post"

export default PostComponent

export const query = graphql`
  query($slug: String!, $formatString: String!) {
    post:ghostPost(slug: { eq: $slug }) {
      slug
      title
      date:created_at(formatString: $formatString)
      tags {
        name
        slug
      }
      description:meta_description
      canonicalUrl:canonical_url
      body:html
      excerpt
      timeToRead:reading_time

    }
  }
`
/** @jsx jsx */
import { jsx, Heading } from "theme-ui"
import { MDXRenderer } from "gatsby-plugin-mdx"
import Layout from "@lekoarts/gatsby-theme-minimal-blog/src/components/layout"
import SEO from "@lekoarts/gatsby-theme-minimal-blog/src/components/seo"

type PageProps = {
  data: {
    page: {
      title: string
      slug: string
      excerpt: string
      body: string
    }
  }
  [key: string]: any
}

const Page = ({ data: { page } }: PageProps) => (
  <Layout>
    <SEO title={page.title} description={page.excerpt} />
    <Heading as="h1" variant="styles.h1">
      {page.title}
    </Heading>
    <section 
      sx={{ 
        my: 5, 
        variant: `layout.content`,
        img: { width: `100%` },
        a: { 
            color: `primary`,
            '&:link': { textDecoration: "none" },
            '&:hover': { textDecoration: "underline" },
        } 
      }}
    >
    <section dangerouslySetInnerHTML={{ __html: page.body }} />
    </section>
  </Layout>
)

export default Page
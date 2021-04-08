import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import getTopic from "app/school/topics/queries/getTopic"
import deleteTopic from "app/school/topics/mutations/deleteTopic"

export const Topic = () => {
  const router = useRouter()
  const topicId = useParam("topicId", "string")
  const [deleteTopicMutation] = useMutation(deleteTopic)
  const [topic] = useQuery(getTopic, { id: topicId! })

  return (
    <>
      <Head>
        <title>Topic {topic.id}</title>
      </Head>

      <div>
        <h1>Topic {topic.id}</h1>
        <pre>{JSON.stringify(topic, null, 2)}</pre>

        <Link href={`/topics/${topic.id}/edit`}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteTopicMutation({ id: topic.id })
              router.push("/topics")
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowTopicPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href="/topics">
          <a>Topics</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Topic />
      </Suspense>
    </div>
  )
}

ShowTopicPage.authenticate = true
ShowTopicPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowTopicPage

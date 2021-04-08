import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import getTopic from "app/school/topics/queries/getTopic"
import updateTopic from "app/school/topics/mutations/updateTopic"
import { TopicForm, FORM_ERROR } from "app/school/topics/components/TopicForm"

export const EditTopic = () => {
  const router = useRouter()
  const topicId = useParam("topicId", "number")
  const [topic, { setQueryData }] = useQuery(getTopic, { id: topicId })
  const [updateTopicMutation] = useMutation(updateTopic)

  return (
    <>
      <Head>
        <title>Edit Topic {topic.id}</title>
      </Head>

      <div>
        <h1>Edit Topic {topic.id}</h1>
        <pre>{JSON.stringify(topic)}</pre>

        <TopicForm
          submitText="Update Topic"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateTopic}
          initialValues={topic}
          onSubmit={async (values) => {
            try {
              const updated = await updateTopicMutation({
                id: topic.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(`/topics/${updated.id}`)
            } catch (error) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const EditTopicPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditTopic />
      </Suspense>

      <p>
        <Link href="/topics">
          <a>Topics</a>
        </Link>
      </p>
    </div>
  )
}

EditTopicPage.authenticate = true
EditTopicPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditTopicPage

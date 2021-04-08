import { Link, useRouter, useMutation, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import createTopic from "app/school/topics/mutations/createTopic"
import { TopicForm, FORM_ERROR } from "app/school/topics/components/TopicForm"

const NewTopicPage: BlitzPage = () => {
  const router = useRouter()
  const [createTopicMutation] = useMutation(createTopic)

  return (
    <div>
      <h1>Create New Topic</h1>

      <TopicForm
        submitText="Create Topic"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateTopic}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const topic = await createTopicMutation(values)
            router.push(`/topics/${topic.id}`)
          } catch (error) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href="/topics">
          <a>Topics</a>
        </Link>
      </p>
    </div>
  )
}

NewTopicPage.authenticate = true
NewTopicPage.getLayout = (page) => <Layout title={"Create New Topic"}>{page}</Layout>

export default NewTopicPage

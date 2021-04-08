import React, { FC } from "react"
import { Box, Button, Flex, Heading } from "@chakra-ui/react"
import { Link } from "blitz"

interface Props {
  title: string
  buttonsLabels: string[]
  buttonsLinks: string[]
}

export const DashboardCard: FC<Props> = ({ children, title, buttonsLabels, buttonsLinks }) => {
  return (
    <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg" m={4}>
      <Heading m={2}>{title}</Heading>
      <Flex w="full" direction="column">
        {buttonsLabels.map((label, index) => {
          return (
            <Link key={index} href={buttonsLinks[index] || "#"}>
              <Button colorScheme="blue" size="lg" m={2}>
                {label}
              </Button>
            </Link>
          )
        })}
      </Flex>
    </Box>
  )
}

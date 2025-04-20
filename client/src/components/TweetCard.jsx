import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

// eslint-disable-next-line react/prop-types
const TweetCard = ({ index , tweet}) => {
  return (
    <Card className="border-black-4 bg-black-1">
        <CardHeader>
            <CardTitle>Tweet {index + 1} </CardTitle>
        </CardHeader>
        <CardContent className="text-[12px] md:text-sm font-semibold">
            {tweet}
        </CardContent>
    </Card>
  )
}

export default TweetCard
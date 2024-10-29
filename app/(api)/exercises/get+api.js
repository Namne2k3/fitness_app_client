export default async function GET() {
    try {
        return Response.json({})
    } catch (error) {
        return Response.json({ error: error }, { status: 500 })
    }
}
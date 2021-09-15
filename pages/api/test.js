import transcript from '../../utils/transcript'
export default async (req, res) => {
    res.send(transcript('test'))
}
import Axios  from "axios";

export const convertData = async (req, res) => {
    const path = process.env.API_URL
    const key = process.env.API_KEY

    try {
        const { from, to, amount} = req.body
        const url = `${path}/${key}/pair/${from}/${to}/${amount}`

        const response = await Axios.get(url)

        if(response.data && response.data.result === 'success'){
            res.status(200).json({
                base: from,
                target: to,
                conversionRate: response.data.conversion_rate,
                conversionAmount: response.data.conversion_result
            })
        }else{
            res.status(400).json({
                msg: 'error al convertir la divisa',
                details: response.data
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'se produjo un error', error
        })
    }
}
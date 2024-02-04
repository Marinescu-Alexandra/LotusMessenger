import { connect } from 'mongoose'

const databaseConnect = () => {
    connect(process.env.DATABASE_URL)
    .then(() => {
        console.log("Mongodb Database Connected")
    }).catch(error => {
        console.log(error)
    })
}

export default databaseConnect;
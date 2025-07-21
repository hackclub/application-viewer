import AWS from 'aws-sdk'
import { Converter } from 'showdown'

AWS.config.update({
  accessKeyId: process.env.SES_ACCESS_KEY_ID,
  secretAccessKey: process.env.SES_SECRET_ACCESS_KEY,
  region: process.env.SES_REGION,
})

const ses = new AWS.SES({ apiVersion: '2010-12-01' })

export const sendEmail = ({ from, to, cc, bcc, message, subject }) => (
  new Promise((resolve, reject) => {
    const html = new Converter().makeHtml(message)

    const Destination = {}
    if (to) {
      const ToAddresses = Array.isArray(to) ? to : [to]
      Destination.ToAddresses = ToAddresses
    }
    if (cc) {
      const CcAddresses = Array.isArray(cc) ? cc : [cc]
      Destination.CcAddresses = CcAddresses
    }
    if (bcc) {
      const BccAddresses = Array.isArray(bcc) ? bcc : [bcc]
      Destination.BccAddresses = BccAddresses
    }
    const params = {
      Destination,
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: html,
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      ReturnPath: from, // reply will go here
      Source: from // sender is here
    }

    ses.sendEmail(params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
)

export const checkEmail = ({ address }) => (
  new Promise((resolve, reject) => {
    ses.getIdentityVerificationAttributes({
      Identities: [address]
    }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        const status = data?.VerificationAttributes[address]?.VerificationStatus
        resolve(status === 'Success')
      }
    })
  })
)

export const sendVerification = ({ address }) => (
  new Promise((resolve, reject) => {
    ses.verifyEmailIdentity({
      EmailAddress: address
    }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
)
import schedule from 'node-schedule'
import nodemailer from 'nodemailer'
import { collectOrder } from 'services/collector/collector'
import { findUsersPopulated } from 'services/dbService'
import UserPopulated from 'appTypes/UserPopulated'
import ParsedAd from 'appTypes/ParsedAd'

interface IArgs {
  debug?: string
  email?: string
}

const args: IArgs = process.argv.slice(2).reduce((res, cur) => {
  const arg = cur.split('=')
  // @ts-ignore
  res[arg[0]] = arg[1]
  return res
}, {})

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gecars2222@gmail.com',
    pass: 'slaptazodis',
  },
})

async function sendMail(to: string, ads: ParsedAd[]) {
  console.log('Send mail to', to)

  if (ads.length < 1) return

  let mail = '<h3>Sveiki, gecras skelbimai!</h3><table>'

  for (const ad of ads) {
    mail += `<tr>
               <td>
                    <a href="${ad.url}"><img style="width:130px" src="${ad.img}"></a>    
                </td>
                <td>
                    <a href="${ad.url}">
                        <div>${ad.title}</div> 
                        <div>metai:${ad.year}</div>
                        <div>kaina:${ad.price}</div>
                        <div>filtro id:${ad.filterId}</div>
                        <div>puslapis:${ad.provider}</div>
                    </a>
                </td>
           </tr>`
  }

  mail += '</table>'

  let mailOptions = {
    from: 'skelbimai@gecar.lt', // sender address
    to: to, // list of receivers
    subject: 'gecars - nauji skelbimai', // Subject line
    text: mail, // plain text body
    html: mail, // html body
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    }
    console.log('Message %s sent: %s', info.messageId, info.response)
  })
}

const collectOrders = async function(debug: boolean) {
  // load users
  console.log('Start collect orders.')

  // @ts-ignore
  const users = (await findUsersPopulated()) as UserPopulated[]

  console.log('users')
  console.log(JSON.stringify(users))

  for (let user of users) {
    for (let order of user.orders) {
      try {
        const ads = await collectOrder(order)
        console.log('Send Total ads:', ads.length)
        console.log('Of user:', ads.length)
        if (args.email) sendMail(args.email, ads)
        if (!args.debug) sendMail(order.user.email, ads)
      } catch (err) {
        console.log(err.stack)
        console.log(err)
      }
    }
  }
  return true
}

console.log('Application command line arguments', args)

if (args.debug) {
  collectOrders(true)
}

schedule.scheduleJob('0 * * * *', function() {
  console.log('running a task every hour')
  collectOrders(false)
})

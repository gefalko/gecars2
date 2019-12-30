import providers from 'appData/providers'
import {
  updateProvider,
} from 'services/dbService'

async function init() {
  for (const provider of providers) {
    try {
      console.log('Update ' + provider.name + ' to', provider)
      const uProvider = await updateProvider(provider.name, provider)
      console.log('Updated provider', uProvider)
    } catch (err) {
      console.log(err.message)
    }
  }	

  process.exit()	
}

init()

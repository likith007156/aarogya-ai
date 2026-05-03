import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.patient.deleteMany()
  await prisma.pHC.deleteMany()

  const phcs = [
    { name: 'Whitefield PHC', latitude: 12.9698, longitude: 77.7499, slots: 15 },
    { name: 'Hosur Road PHC', latitude: 12.8711, longitude: 77.6534, slots: 8 },
    { name: 'Yelahanka PHC', latitude: 13.1007, longitude: 77.5963, slots: 22 },
    { name: 'Kengeri PHC', latitude: 12.9176, longitude: 77.4819, slots: 5 },
    { name: 'Hebbal PHC', latitude: 13.0354, longitude: 77.5988, slots: 12 },
  ]

  for (const phc of phcs) {
    await prisma.pHC.create({ data: phc })
  }

  const patients = [
    { name: 'Ramesh Kumar', age: 45, village: 'Bidadi', riskLevel: 'HIGH', suspectedDisease: 'TB', abhaId: '12-3456-7890-1234' },
    { name: 'Sunita Devi', age: 32, village: 'Kumbalgodu', riskLevel: 'MEDIUM', suspectedDisease: 'Anemia' },
    { name: 'Raju Bhai', age: 50, village: 'Nelmangala', riskLevel: 'LOW', suspectedDisease: 'None' },
    { name: 'Lakshmi', age: 28, village: 'Hoskote', riskLevel: 'HIGH', suspectedDisease: 'TB' },
    { name: 'Kiran', age: 60, village: 'Devanahalli', riskLevel: 'HIGH', suspectedDisease: 'Diabetes' },
    { name: 'Anil', age: 35, village: 'Dodaballapur', riskLevel: 'LOW', suspectedDisease: 'None' },
    { name: 'Sita', age: 40, village: 'Magadi', riskLevel: 'MEDIUM', suspectedDisease: 'Hypertension' },
    { name: 'Venkatesh', age: 55, village: 'Ramanagara', riskLevel: 'LOW', suspectedDisease: 'None' },
    { name: 'Parvathi', age: 48, village: 'Kanakapura', riskLevel: 'MEDIUM', suspectedDisease: 'Diabetes' },
    { name: 'Gopal', age: 65, village: 'Channapatna', riskLevel: 'HIGH', suspectedDisease: 'TB' },
  ]

  for (const p of patients) {
    await prisma.patient.create({ data: p })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

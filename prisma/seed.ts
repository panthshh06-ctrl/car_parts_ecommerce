import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Cleaning database...')
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.wishlistItem.deleteMany()
  await prisma.review.deleteMany()
  await prisma.wheelTyreCompatibility.deleteMany()
  await prisma.galleryBuild.deleteMany()
  await prisma.userGarage.deleteMany()
  await prisma.vehicleFitment.deleteMany()
  await prisma.vehicleVariant.deleteMany()
  await prisma.vehicleGeneration.deleteMany()
  await prisma.vehicleModel.deleteMany()
  await prisma.vehicleManufacturer.deleteMany()
  await prisma.wheelVariant.deleteMany()
  await prisma.wheel.deleteMany()
  await prisma.wheelBrand.deleteMany()
  await prisma.tyreVariant.deleteMany()
  await prisma.tyre.deleteMany()
  await prisma.tyreBrand.deleteMany()
  await prisma.user.deleteMany()

  console.log('Seeding users...')
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@apexfitment.com',
      name: 'Apex Admin',
      role: 'ADMIN',
    },
  })

  const demoUser = await prisma.user.create({
    data: {
      email: 'enthusiast@car.com',
      name: 'Alex Mercer',
      role: 'CUSTOMER',
    },
  })

  console.log('Seeding vehicles...')
  const bmw = await prisma.vehicleManufacturer.create({
    data: { name: 'BMW', country: 'Germany', logoUrl: 'https://www.bmengineworks.co.uk/blog/wp-content/uploads/2023/05/BMW-M8-Gran-Coupe.jpg' }
  })
  const porsche = await prisma.vehicleManufacturer.create({
    data: { name: 'Porsche', country: 'Germany', logoUrl: 'https://i0.wp.com/autoindiadaily.in/wp-content/uploads/2026/06/Porsche-911-GT3-Earls-Court-51-Edition-3.webp?w=1200&ssl=1' }
  })
  const toyota = await prisma.vehicleManufacturer.create({
    data: { name: 'Toyota', country: 'Japan', logoUrl: 'https://hips.hearstapps.com/hmg-prod/images/2026-toyota-camry-se-hybrid-nightshade-fwd-155-695bf27312d0c.jpg?crop=0.731xw:0.546xh;0.177xw,0.328xh&resize=1200:*' }
  })
  const honda = await prisma.vehicleManufacturer.create({
    data: { name: 'Honda', country: 'Japan', logoUrl: 'https://tractionlife.com/wp-content/uploads/2024/01/Honda-NSX-R-Conversion.jpg' }
  })

  // BMW 3 Series G20
  const series3 = await prisma.vehicleModel.create({
    data: { name: '3 Series', manufacturerId: bmw.id }
  })
  const g20Gen = await prisma.vehicleGeneration.create({
    data: { name: 'G20 (2019-Present)', modelId: series3.id, startYear: 2019, endYear: 2026 }
  })
  const v330i = await prisma.vehicleVariant.create({
    data: {
      name: '330i M-Sport',
      generationId: g20Gen.id,
      bodyType: 'Sedan',
      driveType: 'RWD',
      engine: '2.0L Turbo I4',
      oemWheelDiam: 18,
      oemWheelWidth: 8.0,
      oemTyreSize: '225/45R18',
      boltPattern: '5x112',
      centreBore: 66.6,
      oemOffset: 30,
      minOffset: 25,
      maxOffset: 42,
      minWidth: 8.0,
      maxWidth: 10.0,
    }
  })

  await prisma.vehicleFitment.create({
    data: {
      variantId: v330i.id,
      notes: 'Standard M-Sport suspension clears 19x9.5 +35 flush setup nicely.',
      recommendedOffset: 35,
      flushOffset: 35,
      aggressiveOffset: 28,
    }
  })

  // Porsche 911 992
  const model911 = await prisma.vehicleModel.create({
    data: { name: '911', manufacturerId: porsche.id }
  })
  const gen992 = await prisma.vehicleGeneration.create({
    data: { name: '992 (2020-Present)', modelId: model911.id, startYear: 2020, endYear: 2026 }
  })
  const v911CarreraS = await prisma.vehicleVariant.create({
    data: {
      name: 'Carrera S',
      generationId: gen992.id,
      bodyType: 'Coupe',
      driveType: 'RWD',
      engine: '3.0L Twin-Turbo Flat-6',
      oemWheelDiam: 20,
      oemWheelWidth: 8.5,
      oemTyreSize: '245/35R20',
      boltPattern: '5x130',
      centreBore: 71.6,
      oemOffset: 50,
      minOffset: 45,
      maxOffset: 60,
      minWidth: 8.5,
      maxWidth: 12.0,
    }
  })

  // Toyota GR Supra A90
  const supra = await prisma.vehicleModel.create({
    data: { name: 'GR Supra', manufacturerId: toyota.id }
  })
  const a90Gen = await prisma.vehicleGeneration.create({
    data: { name: 'A90 (2020-Present)', modelId: supra.id, startYear: 2020, endYear: 2026 }
  })
  const vSupra30 = await prisma.vehicleVariant.create({
    data: {
      name: '3.0 Premium',
      generationId: a90Gen.id,
      bodyType: 'Coupe',
      driveType: 'RWD',
      engine: '3.0L Turbo I6',
      oemWheelDiam: 19,
      oemWheelWidth: 9.0,
      oemTyreSize: '255/35R19',
      boltPattern: '5x112',
      centreBore: 66.6,
      oemOffset: 32,
      minOffset: 25,
      maxOffset: 40,
      minWidth: 8.5,
      maxWidth: 11.0,
    }
  })

  // Honda Civic Type R FL5
  const civic = await prisma.vehicleModel.create({
    data: { name: 'Civic', manufacturerId: honda.id }
  })
  const fl5Gen = await prisma.vehicleGeneration.create({
    data: { name: 'FL5 Type R (2023-Present)', modelId: civic.id, startYear: 2023, endYear: 2026 }
  })
  const vTypeR = await prisma.vehicleVariant.create({
    data: {
      name: 'Type R',
      generationId: fl5Gen.id,
      bodyType: 'Hatchback',
      driveType: 'FWD',
      engine: '2.0L Turbo VTEC I4',
      oemWheelDiam: 19,
      oemWheelWidth: 9.5,
      oemTyreSize: '265/30R19',
      boltPattern: '5x120',
      centreBore: 64.1,
      oemOffset: 60,
      minOffset: 45,
      maxOffset: 62,
      minWidth: 8.5,
      maxWidth: 10.5,
    }
  })

  console.log('Seeding wheels & tyres...')
  const enkei = await prisma.wheelBrand.create({ data: { name: 'Enkei', logoUrl: 'https://enkei.com/wp-content/uploads/2019/12/ENKEI-RPF1-SBC-125-WEB.jpg' } })
  const volk = await prisma.wheelBrand.create({ data: { name: 'Volk Racing', logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnETUjPT4RKoYRnXwNLK2H4xfrUvAFV67nDX9btrcDa3ROjeJYokyfAdw&s=10' } })
  const bbs = await prisma.wheelBrand.create({ data: { name: 'BBS', logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSShc_lsUG25c3L_KLelRUKn2CvW2Kq3t5s5FxzqB5i6ae4rMGt3tZKUBq4&s=10' } })
  const rotiform = await prisma.wheelBrand.create({ data: { name: 'Rotiform', logoUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=200&q=80' } })

  const wheelRpf1 = await prisma.wheel.create({
    data: {
      brandId: enkei.id,
      modelName: 'RPF1',
      description: 'Legendary lightweight twin-spoke design engineered for racing pedigree and supreme track durability.',
      construction: 'Flow Formed',
      material: 'Aluminum Alloy',
      imageUrl: 'https://enkei.com/wp-content/uploads/2019/12/ENKEI-RPF1-SBC-125-WEB.jpg',
      galleryImages: JSON.stringify([
        'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80'
      ])
    }
  })

  const rpf1Variant1 = await prisma.wheelVariant.create({
    data: {
      wheelId: wheelRpf1.id,
      diameter: 18,
      width: 8.5,
      offset: 35,
      boltPattern: '5x112',
      centreBore: 75.0,
      finish: 'Matte Bronze',
      color: 'Bronze',
      weightKg: 7.9,
      loadRatingKg: 690,
      price: 28500,
      stockQty: 18,
      sku: 'ENK-RPF1-1885-35-5112-BRZ'
    }
  })

  const rpf1Variant2 = await prisma.wheelVariant.create({
    data: {
      wheelId: wheelRpf1.id,
      diameter: 19,
      width: 9.5,
      offset: 35,
      boltPattern: '5x112',
      centreBore: 75.0,
      finish: 'Bright Silver',
      color: 'Silver',
      weightKg: 8.6,
      loadRatingKg: 710,
      price: 34200,
      stockQty: 12,
      sku: 'ENK-RPF1-1995-35-5112-SLV'
    }
  })

  const wheelTe37 = await prisma.wheel.create({
    data: {
      brandId: volk.id,
      modelName: 'TE37SL',
      description: 'The iconic 6-spoke masterpiece. Unmatched strength-to-weight ratio for high-performance sports cars.',
      construction: 'Monoblock Forged',
      material: 'A6061-T6 Aluminum',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnETUjPT4RKoYRnXwNLK2H4xfrUvAFV67nDX9btrcDa3ROjeJYokyfAdw&s=10',
      galleryImages: JSON.stringify([
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnETUjPT4RKoYRnXwNLK2H4xfrUvAFV67nDX9btrcDa3ROjeJYokyfAdw&s=10'
      ])
    }
  })

  const te37Variant = await prisma.wheelVariant.create({
    data: {
      wheelId: wheelTe37.id,
      diameter: 19,
      width: 9.5,
      offset: 30,
      boltPattern: '5x120',
      centreBore: 72.6,
      finish: 'Pressed Graphite',
      color: 'Grey',
      weightKg: 8.1,
      loadRatingKg: 750,
      price: 58000,
      stockQty: 8,
      sku: 'VOLK-TE37-1995-30-5120-PG'
    }
  })

  const wheelLm = await prisma.wheel.create({
    data: {
      brandId: bbs.id,
      modelName: 'LM-R',
      description: 'Timeless multi-piece mesh design blending motorsport pedigree with elite luxury aesthetic.',
      construction: 'Multi-Piece Forged',
      material: 'Forged Aluminum',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSShc_lsUG25c3L_KLelRUKn2CvW2Kq3t5s5FxzqB5i6ae4rMGt3tZKUBq4&s=10',
      galleryImages: JSON.stringify([
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSShc_lsUG25c3L_KLelRUKn2CvW2Kq3t5s5FxzqB5i6ae4rMGt3tZKUBq4&s=10'
      ])
    }
  })

  const lmVariant = await prisma.wheelVariant.create({
    data: {
      wheelId: wheelLm.id,
      diameter: 20,
      width: 10.0,
      offset: 38,
      boltPattern: '5x112',
      centreBore: 66.6,
      finish: 'Diamond Black / Polished Lip',
      color: 'Black',
      weightKg: 10.4,
      loadRatingKg: 810,
      price: 72000,
      stockQty: 6,
      sku: 'BBS-LMR-2010-38-5112-DBK'
    }
  })

  // Tyres
  const michelin = await prisma.tyreBrand.create({ data: { name: 'Michelin', logoUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=200&q=80' } })
  const pirelli = await prisma.tyreBrand.create({ data: { name: 'Pirelli', logoUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=200&q=80' } })
  const bridgestone = await prisma.tyreBrand.create({ data: { name: 'Bridgestone', logoUrl: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=200&q=80' } })

  const tyrePs4s = await prisma.tyre.create({
    data: {
      brandId: michelin.id,
      modelName: 'Pilot Sport 4S',
      description: 'Maximum performance summer tyre delivering exceptional grip on wet and dry roads with track capability.',
      category: 'Performance',
      season: 'Summer',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJiz3BGPLSFvGYxPZeRFInEIeL0Ws32FdFs_IPMf7P-osdJJapZjKxoVeT&s=10'
    }
  })

  const ps4sVariant1 = await prisma.tyreVariant.create({
    data: {
      tyreId: tyrePs4s.id,
      width: 235,
      aspectRatio: 40,
      rimDiameter: 18,
      loadIndex: 95,
      speedRating: 'Y',
      wetGrip: 'A',
      dryPerformance: 9.8,
      comfortRating: 8.5,
      treadwear: 300,
      price: 19500,
      stockQty: 30,
      sku: 'MIC-PS4S-2354018-95Y'
    }
  })

  const ps4sVariant2 = await prisma.tyreVariant.create({
    data: {
      tyreId: tyrePs4s.id,
      width: 255,
      aspectRatio: 35,
      rimDiameter: 19,
      loadIndex: 96,
      speedRating: 'Y',
      wetGrip: 'A',
      dryPerformance: 9.9,
      comfortRating: 8.2,
      treadwear: 300,
      price: 24500,
      stockQty: 24,
      sku: 'MIC-PS4S-2553519-96Y'
    }
  })

  const tyreTrofeo = await prisma.tyre.create({
    data: {
      brandId: pirelli.id,
      modelName: 'P Zero Trofeo R',
      description: 'Street-legal track tyre engineered for ultimate dry lap times and razor-sharp steering feedback.',
      category: 'Track/Competition',
      season: 'Summer',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr0jQiCg_QJyIp1eomubvl9KO4zq293BTXqqIYaGQgfxTl3j4neWHLFWM&s=10'
    }
  })

  const trofeoVariant = await prisma.tyreVariant.create({
    data: {
      tyreId: tyreTrofeo.id,
      width: 265,
      aspectRatio: 30,
      rimDiameter: 19,
      loadIndex: 93,
      speedRating: 'Y',
      wetGrip: 'B',
      dryPerformance: 10.0,
      comfortRating: 6.5,
      treadwear: 60,
      price: 32000,
      stockQty: 10,
      sku: 'PIR-TROF-2653019-93Y'
    }
  })

  console.log('Seeding wheel-tyre compatibilities...')
  await prisma.wheelTyreCompatibility.create({
    data: {
      wheelVariantId: rpf1Variant1.id,
      tyreVariantId: ps4sVariant1.id,
      isRecommended: true,
    }
  })

  await prisma.wheelTyreCompatibility.create({
    data: {
      wheelVariantId: rpf1Variant2.id,
      tyreVariantId: ps4sVariant2.id,
      isRecommended: true,
    }
  })

  await prisma.wheelTyreCompatibility.create({
    data: {
      wheelVariantId: te37Variant.id,
      tyreVariantId: trofeoVariant.id,
      isRecommended: true,
    }
  })

  console.log('Seeding gallery builds...')
  await prisma.galleryBuild.create({
    data: {
      title: 'BMW G20 330i on Enkei RPF1 Bronze',
      carDetails: '2024 BMW 330i M-Sport',
      variantId: v330i.id,
      imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
      wheelSetup: '18x8.5 +35 Matte Bronze Enkei RPF1',
      tyreSetup: '235/40R18 Michelin Pilot Sport 4S',
      suspension: 'KW Variant 3 Coilovers (-30mm drop)',
      stance: 'Aggressive Flush, Zero Rubbing',
      ownerName: 'Vikram S.',
      likesCount: 184
    }
  })

  await prisma.galleryBuild.create({
    data: {
      title: 'Porsche 911 Carrera S on BBS LM-R',
      carDetails: '2022 Porsche 911 Carrera S (992)',
      variantId: v911CarreraS.id,
      imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      wheelSetup: '20x10 +38 Diamond Black BBS LM-R',
      tyreSetup: '245/35R20 Pirelli P Zero',
      suspension: 'OEM PASM Sport Lowering Springs',
      stance: 'OEM+ Stance',
      ownerName: 'Marcus V.',
      likesCount: 312
    }
  })

  console.log('Seeding user garage & sample order...')
  await prisma.userGarage.create({
    data: {
      userId: demoUser.id,
      variantId: v330i.id,
      nickname: 'Daily Cruiser',
      isPrimary: true
    }
  })

  await prisma.order.create({
    data: {
      userId: demoUser.id,
      totalAmount: 232800,
      status: 'PROCESSING',
      paymentStatus: 'PAID',
      shippingAddress: '42 Apex Lane, Automotive District, CA 90210',
      contactPhone: '+1 (555) 382-9102',
      trackingNumber: 'APEX-98234192',
      items: {
        create: [
          {
            type: 'PACKAGE',
            wheelVariantId: rpf1Variant1.id,
            tyreVariantId: ps4sVariant1.id,
            quantity: 4,
            unitPrice: 58200,
            mountedBalanced: true
          }
        ]
      }
    }
  })

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

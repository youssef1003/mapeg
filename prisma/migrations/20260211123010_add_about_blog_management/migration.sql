-- CreateTable
CREATE TABLE "AboutPageContent" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "heroTitleAr" TEXT NOT NULL DEFAULT 'من نحن',
    "heroTitleEn" TEXT NOT NULL DEFAULT 'About Us',
    "heroHighlightAr" TEXT NOT NULL DEFAULT 'MapEg',
    "heroHighlightEn" TEXT NOT NULL DEFAULT 'MapEg',
    "heroSubtitleAr" TEXT NOT NULL,
    "heroSubtitleEn" TEXT NOT NULL,
    "missionTitleAr" TEXT NOT NULL DEFAULT 'مهمتنا',
    "missionTitleEn" TEXT NOT NULL DEFAULT 'Our Mission',
    "missionTextAr" TEXT NOT NULL,
    "missionTextEn" TEXT NOT NULL,
    "candidatesPlaced" TEXT NOT NULL DEFAULT '15,000+',
    "partnerCompanies" TEXT NOT NULL DEFAULT '2,500+',
    "countriesCovered" TEXT NOT NULL DEFAULT '10+',
    "valuesTitleAr" TEXT NOT NULL DEFAULT 'قيمنا الأساسية',
    "valuesTitleEn" TEXT NOT NULL DEFAULT 'Our Core Values',
    "valuesSubtitleAr" TEXT NOT NULL,
    "valuesSubtitleEn" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutPageContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutValue" (
    "id" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descriptionAr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutMilestone" (
    "id" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descriptionAr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutTeamMember" (
    "id" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "roleAr" TEXT NOT NULL,
    "roleEn" TEXT NOT NULL,
    "bioAr" TEXT NOT NULL,
    "bioEn" TEXT NOT NULL,
    "image" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutTeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutOffice" (
    "id" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "labelAr" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,
    "addressAr" TEXT NOT NULL,
    "addressEn" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutOffice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPostManaged" (
    "id" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "excerptAr" TEXT NOT NULL,
    "excerptEn" TEXT NOT NULL,
    "contentAr" TEXT NOT NULL,
    "contentEn" TEXT NOT NULL,
    "authorAr" TEXT NOT NULL,
    "authorEn" TEXT NOT NULL,
    "categoryAr" TEXT NOT NULL,
    "categoryEn" TEXT NOT NULL,
    "image" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPostManaged_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogCategory" (
    "id" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlogCategory_nameAr_key" ON "BlogCategory"("nameAr");

-- CreateIndex
CREATE UNIQUE INDEX "BlogCategory_nameEn_key" ON "BlogCategory"("nameEn");

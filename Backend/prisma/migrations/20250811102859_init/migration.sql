-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "profile_photo" TEXT,
    "language_pref" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Trip" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "trip_name" TEXT NOT NULL,
    "description" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "cover_photo" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."City" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "cost_index" DOUBLE PRECISION,
    "popularity_score" DOUBLE PRECISION,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Activity" (
    "id" SERIAL NOT NULL,
    "city_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "cost" DECIMAL(10,2),
    "duration" INTEGER,
    "description" TEXT,
    "image_url" TEXT,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Itinerary" (
    "id" SERIAL NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "city_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "activity_id" INTEGER,
    "order_index" INTEGER NOT NULL,

    CONSTRAINT "Itinerary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Budget" (
    "id" SERIAL NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "total_estimated_cost" DECIMAL(12,2),
    "transport_cost" DECIMAL(12,2),
    "accommodation_cost" DECIMAL(12,2),
    "activities_cost" DECIMAL(12,2),
    "daily_average_cost" DECIMAL(12,2),

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SharedTrip" (
    "id" SERIAL NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "public_url" TEXT NOT NULL,
    "share_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedTrip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AdminStat" (
    "id" SERIAL NOT NULL,
    "metric_name" TEXT NOT NULL,
    "metric_value" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminStat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "Trip_user_id_idx" ON "public"."Trip"("user_id");

-- CreateIndex
CREATE INDEX "City_name_country_idx" ON "public"."City"("name", "country");

-- CreateIndex
CREATE UNIQUE INDEX "city_name_country_unique" ON "public"."City"("name", "country");

-- CreateIndex
CREATE INDEX "Activity_city_id_idx" ON "public"."Activity"("city_id");

-- CreateIndex
CREATE INDEX "Itinerary_trip_id_date_idx" ON "public"."Itinerary"("trip_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Itinerary_trip_id_date_order_index_key" ON "public"."Itinerary"("trip_id", "date", "order_index");

-- CreateIndex
CREATE UNIQUE INDEX "Budget_trip_id_key" ON "public"."Budget"("trip_id");

-- CreateIndex
CREATE UNIQUE INDEX "SharedTrip_public_url_key" ON "public"."SharedTrip"("public_url");

-- CreateIndex
CREATE INDEX "SharedTrip_trip_id_idx" ON "public"."SharedTrip"("trip_id");

-- CreateIndex
CREATE INDEX "AdminStat_metric_name_date_idx" ON "public"."AdminStat"("metric_name", "date");

-- AddForeignKey
ALTER TABLE "public"."Trip" ADD CONSTRAINT "Trip_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Activity" ADD CONSTRAINT "Activity_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "public"."City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Itinerary" ADD CONSTRAINT "Itinerary_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Itinerary" ADD CONSTRAINT "Itinerary_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "public"."City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Itinerary" ADD CONSTRAINT "Itinerary_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "public"."Activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Budget" ADD CONSTRAINT "Budget_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SharedTrip" ADD CONSTRAINT "SharedTrip_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

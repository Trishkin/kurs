﻿// <auto-generated />
using System;
using Kursach4.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Kursach4.Migrations
{
    [DbContext(typeof(ParkingContext))]
    partial class ParkingContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .UseIdentityColumns()
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("ProductVersion", "5.0.0");

            modelBuilder.Entity("Kursach1.Models.Order", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .UseIdentityColumn();

                    b.Property<DateTime>("EndDate")
                        .HasColumnType("datetime");

                    b.Property<bool>("IsComplete")
                        .HasColumnType("bit");

                    b.Property<double>("Price")
                        .HasColumnType("float");

                    b.Property<int?>("SlotId")
                        .HasColumnType("int");

                    b.Property<DateTime>("StartDate")
                        .HasColumnType("datetime");

                    b.Property<int?>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("SlotId");

                    b.HasIndex("UserId");

                    b.ToTable("Orders");
                });

            modelBuilder.Entity("Kursach1.Models.Parking", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .UseIdentityColumn();

                    b.Property<string>("Address")
                        .HasColumnType("nvarchar(MAX)");

                    b.Property<double>("PriceDay")
                        .HasColumnType("float");

                    b.Property<double>("PriceHour")
                        .HasColumnType("float");

                    b.HasKey("Id");

                    b.ToTable("Parking");
                });

            modelBuilder.Entity("Kursach1.Models.Slot", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .UseIdentityColumn();

                    b.Property<bool>("IsOccupied")
                        .HasColumnType("bit");

                    b.Property<int>("Number")
                        .HasColumnType("int");

                    b.Property<int?>("ParkingId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ParkingId");

                    b.ToTable("Slots");
                });

            modelBuilder.Entity("Kursach1.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .UseIdentityColumn();

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(MAX)");

                    b.Property<string>("Firstname")
                        .HasColumnType("nvarchar(MAX)");

                    b.Property<byte[]>("Image")
                        .HasColumnType("varbinary(MAX)");

                    b.Property<string>("Lastname")
                        .HasColumnType("nvarchar(MAX)");

                    b.Property<string>("Password")
                        .HasColumnType("nvarchar(MAX)");

                    b.Property<string>("Role")
                        .HasColumnType("nvarchar(MAX)");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Kursach1.Models.Order", b =>
                {
                    b.HasOne("Kursach1.Models.Slot", "Slot")
                        .WithMany("Orders")
                        .HasForeignKey("SlotId");

                    b.HasOne("Kursach1.Models.User", "User")
                        .WithMany("Orders")
                        .HasForeignKey("UserId");

                    b.Navigation("Slot");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Kursach1.Models.Slot", b =>
                {
                    b.HasOne("Kursach1.Models.Parking", "Parking")
                        .WithMany("Slots")
                        .HasForeignKey("ParkingId");

                    b.Navigation("Parking");
                });

            modelBuilder.Entity("Kursach1.Models.Parking", b =>
                {
                    b.Navigation("Slots");
                });

            modelBuilder.Entity("Kursach1.Models.Slot", b =>
                {
                    b.Navigation("Orders");
                });

            modelBuilder.Entity("Kursach1.Models.User", b =>
                {
                    b.Navigation("Orders");
                });
#pragma warning restore 612, 618
        }
    }
}

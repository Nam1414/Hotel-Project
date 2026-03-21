CREATE DATABASE HotelManagementDB
GO
USE [HotelManagementDB]
GO
/****** Object:  Table [dbo].[Vouchers]    Script Date: 3/7/2026 11:00:16 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Vouchers]') AND type in (N'U'))
DROP TABLE [dbo].[Vouchers]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 3/7/2026 11:00:16 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
DROP TABLE [dbo].[Users]
GO
/****** Object:  Table [dbo].[Services]    Script Date: 3/7/2026 11:00:16 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Services]') AND type in (N'U'))
DROP TABLE [dbo].[Services]
GO
/****** Object:  Table [dbo].[Service_Categories]    Script Date: 3/7/2026 11:00:16 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Service_Categories]') AND type in (N'U'))
DROP TABLE [dbo].[Service_Categories]
GO
/****** Object:  Table [dbo].[RoomType_Amenities]    Script Date: 3/7/2026 11:00:16 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RoomType_Amenities]') AND type in (N'U'))
DROP TABLE [dbo].[RoomType_Amenities]
GO
/****** Object:  Table [dbo].[Rooms]    Script Date: 3/7/2026 11:00:16 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Rooms]') AND type in (N'U'))
DROP TABLE [dbo].[Rooms]
GO
/****** Object:  Table [dbo].[Room_Types]    Script Date: 3/7/2026 11:00:16 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Room_Types]') AND type in (N'U'))
DROP TABLE [dbo].[Room_Types]
GO
/****** Object:  Table [dbo].[Room_Inventory]    Script Date: 3/7/2026 11:00:16 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Room_Inventory]') AND type in (N'U'))
DROP TABLE [dbo].[Room_Inventory]
GO
/****** Object:  Table [dbo].[Room_Images]    Script Date: 3/7/2026 11:00:16 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Room_Images]') AND type in (N'U'))
DROP TABLE [dbo].[Room_Images]
GO
/****** Object:  Table [dbo].[Roles]    Script Date: 3/7/2026 11:00:16 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Roles]') AND type in (N'U'))
DROP TABLE [dbo].[Roles]
GO
/****** Object:  Table [dbo].[Role_Permissions]    Script Date: 3/7/2026 11:00:16 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Role_Permissions]') AND type in (N'U'))
DROP TABLE [dbo].[Role_Permissions]
GO
/****** Object:  Table [dbo].[Reviews]    Script Date: 3/7/2026 11:00:16 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Reviews]') AND type in (N'U'))
DROP TABLE [dbo].[Reviews]
GO
/****** Object:  Table [dbo].[Permissions]    Script Date: 3/7/2026 11:00:16 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Permissions]') AND type in (N'U'))
DROP TABLE [dbo].[Permissions]
GO
/****** Object:  Table [dbo].[Payments]    Script Date: 3/7/2026 11:00:16 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Payments]') AND type in (N'U'))
DROP TABLE [dbo].[Payments]
GO
/****** Object:  Table [dbo].[Order_Services]    Script Date: 3/7/2026 11:00:16 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Order_Services]') AND type in (N'U'))
DROP TABLE [dbo].[Order_Services]
GO
/****** Object:  Table [dbo].[Order_Service_Details]    Script Date: 3/7/2026 11:00:16 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Order_Service_Details]') AND type in (N'U'))
DROP TABLE [dbo].[Order_Service_Details]
GO
/****** Object:  Table [dbo].[Memberships]    Script Date: 3/7/2026 11:00:16 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Memberships]') AND type in (N'U'))
DROP TABLE [dbo].[Memberships]
GO
/****** Object:  Table [dbo].[Loss_And_Damages]    Script Date: 3/7/2026 11:00:16 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Loss_And_Damages]') AND type in (N'U'))
DROP TABLE [dbo].[Loss_And_Damages]
GO
/****** Object:  Table [dbo].[Invoices]    Script Date: 3/7/2026 11:00:16 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Invoices]') AND type in (N'U'))
DROP TABLE [dbo].[Invoices]
GO
/****** Object:  Table [dbo].[Bookings]    Script Date: 3/7/2026 11:00:16 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Bookings]') AND type in (N'U'))
DROP TABLE [dbo].[Bookings]
GO
/****** Object:  Table [dbo].[Booking_Details]    Script Date: 3/7/2026 11:00:16 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Booking_Details]') AND type in (N'U'))
DROP TABLE [dbo].[Booking_Details]
GO
/****** Object:  Table [dbo].[Audit_Logs]    Script Date: 3/7/2026 11:00:16 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Audit_Logs]') AND type in (N'U'))
DROP TABLE [dbo].[Audit_Logs]
GO
/****** Object:  Table [dbo].[Attractions]    Script Date: 3/7/2026 11:00:16 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Attractions]') AND type in (N'U'))
DROP TABLE [dbo].[Attractions]
GO
/****** Object:  Table [dbo].[Articles]    Script Date: 3/7/2026 11:00:16 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Articles]') AND type in (N'U'))
DROP TABLE [dbo].[Articles]
GO
/****** Object:  Table [dbo].[Article_Categories]    Script Date: 3/7/2026 11:00:16 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Article_Categories]') AND type in (N'U'))
DROP TABLE [dbo].[Article_Categories]
GO
/****** Object:  Table [dbo].[Amenities]    Script Date: 3/7/2026 11:00:16 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Amenities]') AND type in (N'U'))
DROP TABLE [dbo].[Amenities]
GO
USE [master]
GO


USE [HotelManagementDB]
GO
/****** Object:  Table [dbo].[Amenities]    Script Date: 3/7/2026 11:00:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Amenities](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](255) NOT NULL,
	[icon_url] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Article_Categories]    Script Date: 3/7/2026 11:00:16 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Article_Categories](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Articles]    Script Date: 3/7/2026 11:00:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Articles](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[category_id] [int] NULL,
	[author_id] [int] NULL,
	[title] [nvarchar](max) NOT NULL,
	[slug] [nvarchar](255) NULL,
	[content] [nvarchar](max) NULL,
	[thumbnail_url] [nvarchar](max) NULL,
	[published_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Attractions]    Script Date: 3/7/2026 11:00:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Attractions](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](255) NOT NULL,
	[distance_km] [decimal](5, 2) NULL,
	[description] [nvarchar](max) NULL,
	[map_embed_link] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Audit_Logs]    Script Date: 3/7/2026 11:00:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Audit_Logs](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NULL,
	[action] [nvarchar](50) NOT NULL,
	[table_name] [nvarchar](100) NOT NULL,
	[record_id] [int] NOT NULL,
	[old_value] [nvarchar](max) NULL,
	[new_value] [nvarchar](max) NULL,
	[created_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Booking_Details]    Script Date: 3/7/2026 11:00:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Booking_Details](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[booking_id] [int] NULL,
	[room_id] [int] NULL,
	[room_type_id] [int] NULL,
	[check_in_date] [datetime] NOT NULL,
	[check_out_date] [datetime] NOT NULL,
	[price_per_night] [decimal](18, 2) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Bookings]    Script Date: 3/7/2026 11:00:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Bookings](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NULL,
	[guest_name] [nvarchar](255) NULL,
	[guest_phone] [nvarchar](50) NULL,
	[guest_email] [nvarchar](255) NULL,
	[booking_code] [nvarchar](50) NOT NULL,
	[voucher_id] [int] NULL,
	[status] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Invoices]    Script Date: 3/7/2026 11:00:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Invoices](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[booking_id] [int] NULL,
	[total_room_amount] [decimal](18, 2) NULL,
	[total_service_amount] [decimal](18, 2) NULL,
	[discount_amount] [decimal](18, 2) NULL,
	[tax_amount] [decimal](18, 2) NULL,
	[final_total] [decimal](18, 2) NULL,
	[status] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Loss_And_Damages]    Script Date: 3/7/2026 11:00:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Loss_And_Damages](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[booking_detail_id] [int] NULL,
	[room_inventory_id] [int] NULL,
	[quantity] [int] NOT NULL,
	[penalty_amount] [decimal](18, 2) NOT NULL,
	[description] [nvarchar](max) NULL,
	[created_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Memberships]    Script Date: 3/7/2026 11:00:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Memberships](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[tier_name] [nvarchar](100) NOT NULL,
	[min_points] [int] NULL,
	[discount_percent] [decimal](5, 2) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Order_Service_Details]    Script Date: 3/7/2026 11:00:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Order_Service_Details](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[order_service_id] [int] NULL,
	[service_id] [int] NULL,
	[quantity] [int] NOT NULL,
	[unit_price] [decimal](18, 2) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Order_Services]    Script Date: 3/7/2026 11:00:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Order_Services](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[booking_detail_id] [int] NULL,
	[order_date] [datetime] NULL,
	[total_amount] [decimal](18, 2) NULL,
	[status] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Payments]    Script Date: 3/7/2026 11:00:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Payments](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[invoice_id] [int] NULL,
	[payment_method] [nvarchar](50) NULL,
	[amount_paid] [decimal](18, 2) NOT NULL,
	[transaction_code] [nvarchar](100) NULL,
	[payment_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Permissions]    Script Date: 3/7/2026 11:00:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Permissions](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Reviews]    Script Date: 3/7/2026 11:00:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Reviews](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NULL,
	[room_type_id] [int] NULL,
	[rating] [int] NULL,
	[comment] [nvarchar](max) NULL,
	[created_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Role_Permissions]    Script Date: 3/7/2026 11:00:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Role_Permissions](
	[role_id] [int] NOT NULL,
	[permission_id] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[role_id] ASC,
	[permission_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Roles]    Script Date: 3/7/2026 11:00:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Roles](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](100) NOT NULL,
	[description] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Room_Images]    Script Date: 3/7/2026 11:00:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Room_Images](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[room_type_id] [int] NULL,
	[image_url] [nvarchar](max) NOT NULL,
	[is_primary] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Room_Inventory]    Script Date: 3/7/2026 11:00:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Room_Inventory](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[room_id] [int] NULL,
	[item_name] [nvarchar](255) NOT NULL,
	[quantity] [int] NULL,
	[price_if_lost] [decimal](18, 2) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Room_Types]    Script Date: 3/7/2026 11:00:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Room_Types](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](255) NOT NULL,
	[base_price] [decimal](18, 2) NOT NULL,
	[capacity_adults] [int] NOT NULL,
	[capacity_children] [int] NOT NULL,
	[description] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Rooms]    Script Date: 3/7/2026 11:00:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Rooms](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[room_type_id] [int] NULL,
	[room_number] [nvarchar](50) NOT NULL,
	[floor] [int] NULL,
	[status] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RoomType_Amenities]    Script Date: 3/7/2026 11:00:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RoomType_Amenities](
	[room_type_id] [int] NOT NULL,
	[amenity_id] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[room_type_id] ASC,
	[amenity_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Service_Categories]    Script Date: 3/7/2026 11:00:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Service_Categories](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Services]    Script Date: 3/7/2026 11:00:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Services](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[category_id] [int] NULL,
	[name] [nvarchar](255) NOT NULL,
	[price] [decimal](18, 2) NOT NULL,
	[unit] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 3/7/2026 11:00:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[role_id] [int] NULL,
	[membership_id] [int] NULL,
	[full_name] [nvarchar](255) NOT NULL,
	[email] [nvarchar](255) NOT NULL,
	[phone] [nvarchar](50) NULL,
	[password_hash] [nvarchar](max) NOT NULL,
	[status] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Vouchers]    Script Date: 3/7/2026 11:00:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Vouchers](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code] [nvarchar](50) NOT NULL,
	[discount_type] [nvarchar](50) NOT NULL,
	[discount_value] [decimal](18, 2) NOT NULL,
	[min_booking_value] [decimal](18, 2) NULL,
	[valid_from] [datetime] NULL,
	[valid_to] [datetime] NULL,
	[usage_limit] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Amenities] ON 

INSERT [dbo].[Amenities] ([id], [name], [icon_url]) VALUES (1, N'Wifi Miễn Phí', N'wifi.png')
INSERT [dbo].[Amenities] ([id], [name], [icon_url]) VALUES (2, N'Smart TV', N'tv.png')
INSERT [dbo].[Amenities] ([id], [name], [icon_url]) VALUES (3, N'Điều Hòa', N'ac.png')
INSERT [dbo].[Amenities] ([id], [name], [icon_url]) VALUES (4, N'Bồn Tắm Sứ', N'bathtub.png')
INSERT [dbo].[Amenities] ([id], [name], [icon_url]) VALUES (5, N'Ban Công', N'balcony.png')
INSERT [dbo].[Amenities] ([id], [name], [icon_url]) VALUES (6, N'Minibar', N'minibar.png')
INSERT [dbo].[Amenities] ([id], [name], [icon_url]) VALUES (7, N'Két Sắt', N'safe.png')
INSERT [dbo].[Amenities] ([id], [name], [icon_url]) VALUES (8, N'Máy Sấy Tóc', N'hairdryer.png')
INSERT [dbo].[Amenities] ([id], [name], [icon_url]) VALUES (9, N'Máy Pha Cà Phê', N'coffee.png')
INSERT [dbo].[Amenities] ([id], [name], [icon_url]) VALUES (10, N'Bàn Làm Việc', N'desk.png')
SET IDENTITY_INSERT [dbo].[Amenities] OFF
GO
SET IDENTITY_INSERT [dbo].[Article_Categories] ON 

INSERT [dbo].[Article_Categories] ([id], [name]) VALUES (1, N'Tin Tức Khách Sạn')
INSERT [dbo].[Article_Categories] ([id], [name]) VALUES (2, N'Cẩm Nang Du Lịch')
INSERT [dbo].[Article_Categories] ([id], [name]) VALUES (3, N'Khám Phá Ẩm Thực')
INSERT [dbo].[Article_Categories] ([id], [name]) VALUES (4, N'Sự Kiện & Lễ Hội')
INSERT [dbo].[Article_Categories] ([id], [name]) VALUES (5, N'Chương Trình Khuyến Mãi')
INSERT [dbo].[Article_Categories] ([id], [name]) VALUES (6, N'Văn Hóa Địa Phương')
INSERT [dbo].[Article_Categories] ([id], [name]) VALUES (7, N'Hướng Dẫn Di Chuyển')
INSERT [dbo].[Article_Categories] ([id], [name]) VALUES (8, N'Góc Thư Giãn')
INSERT [dbo].[Article_Categories] ([id], [name]) VALUES (9, N'Hỏi Đáp (FAQ)')
INSERT [dbo].[Article_Categories] ([id], [name]) VALUES (10, N'Thư Viện Ảnh')
SET IDENTITY_INSERT [dbo].[Article_Categories] OFF
GO
SET IDENTITY_INSERT [dbo].[Articles] ON 

INSERT [dbo].[Articles] ([id], [category_id], [author_id], [title], [slug], [content], [thumbnail_url], [published_at]) VALUES (1, 1, 1, N'Khai trương nhà hàng mới', N'khai-truong-nha-hang', N'Nội dung...', NULL, CAST(N'2026-03-06T22:07:35.023' AS DateTime))
INSERT [dbo].[Articles] ([id], [category_id], [author_id], [title], [slug], [content], [thumbnail_url], [published_at]) VALUES (2, 2, 2, N'5 điểm đến không thể bỏ lỡ', N'5-diem-den', N'Nội dung...', NULL, CAST(N'2026-03-06T22:07:35.023' AS DateTime))
INSERT [dbo].[Articles] ([id], [category_id], [author_id], [title], [slug], [content], [thumbnail_url], [published_at]) VALUES (3, 3, 3, N'Món ngon hải sản địa phương', N'mon-ngon-hai-san', N'Nội dung...', NULL, CAST(N'2026-03-06T22:07:35.023' AS DateTime))
INSERT [dbo].[Articles] ([id], [category_id], [author_id], [title], [slug], [content], [thumbnail_url], [published_at]) VALUES (4, 4, 1, N'Sự kiện đếm ngược năm mới', N'su-kien-nam-moi', N'Nội dung...', NULL, CAST(N'2026-03-06T22:07:35.023' AS DateTime))
INSERT [dbo].[Articles] ([id], [category_id], [author_id], [title], [slug], [content], [thumbnail_url], [published_at]) VALUES (5, 5, 2, N'Khuyến mãi mùa hè 2026', N'khuyen-mai-mua-he', N'Nội dung...', NULL, CAST(N'2026-03-06T22:07:35.023' AS DateTime))
INSERT [dbo].[Articles] ([id], [category_id], [author_id], [title], [slug], [content], [thumbnail_url], [published_at]) VALUES (6, 6, 3, N'Lịch sử văn hóa vùng miền', N'lich-su-van-hoa', N'Nội dung...', NULL, CAST(N'2026-03-06T22:07:35.023' AS DateTime))
INSERT [dbo].[Articles] ([id], [category_id], [author_id], [title], [slug], [content], [thumbnail_url], [published_at]) VALUES (7, 7, 1, N'Từ sân bay về khách sạn', N'tu-san-bay-ve-ks', N'Nội dung...', NULL, CAST(N'2026-03-06T22:07:35.023' AS DateTime))
INSERT [dbo].[Articles] ([id], [category_id], [author_id], [title], [slug], [content], [thumbnail_url], [published_at]) VALUES (8, 8, 2, N'Cách thư giãn cuối tuần', N'cach-thu-gian', N'Nội dung...', NULL, CAST(N'2026-03-06T22:07:35.023' AS DateTime))
INSERT [dbo].[Articles] ([id], [category_id], [author_id], [title], [slug], [content], [thumbnail_url], [published_at]) VALUES (9, 9, 3, N'Quy định nhận trả phòng', N'quy-dinh-nhan-tra', N'Nội dung...', NULL, CAST(N'2026-03-06T22:07:35.023' AS DateTime))
INSERT [dbo].[Articles] ([id], [category_id], [author_id], [title], [slug], [content], [thumbnail_url], [published_at]) VALUES (10, 10, 1, N'Bộ ảnh resort flycam', N'bo-anh-resort', N'Nội dung...', NULL, CAST(N'2026-03-06T22:07:35.023' AS DateTime))
SET IDENTITY_INSERT [dbo].[Articles] OFF
GO
SET IDENTITY_INSERT [dbo].[Attractions] ON 

INSERT [dbo].[Attractions] ([id], [name], [distance_km], [description], [map_embed_link]) VALUES (1, N'Chợ Trung Tâm', CAST(1.50 AS Decimal(5, 2)), N'Khu chợ truyền thống sầm uất', N'link_map_1')
INSERT [dbo].[Attractions] ([id], [name], [distance_km], [description], [map_embed_link]) VALUES (2, N'Bãi Biển Chính', CAST(0.50 AS Decimal(5, 2)), N'Bãi tắm công cộng tuyệt đẹp', N'link_map_2')
INSERT [dbo].[Attractions] ([id], [name], [distance_km], [description], [map_embed_link]) VALUES (3, N'Bảo Tàng Thành Phố', CAST(3.00 AS Decimal(5, 2)), N'Lưu giữ giá trị lịch sử', N'link_map_3')
INSERT [dbo].[Attractions] ([id], [name], [distance_km], [description], [map_embed_link]) VALUES (4, N'Phố Đi Bộ', CAST(1.00 AS Decimal(5, 2)), N'Khu vực vui chơi giải trí về đêm', N'link_map_4')
INSERT [dbo].[Attractions] ([id], [name], [distance_km], [description], [map_embed_link]) VALUES (5, N'Chùa Cổ Lịch Sử', CAST(5.50 AS Decimal(5, 2)), N'Ngôi chùa linh thiêng', N'link_map_5')
INSERT [dbo].[Attractions] ([id], [name], [distance_km], [description], [map_embed_link]) VALUES (6, N'Khu Vui Chơi Giải Trí', CAST(8.00 AS Decimal(5, 2)), N'Công viên trò chơi quy mô lớn', N'link_map_6')
INSERT [dbo].[Attractions] ([id], [name], [distance_km], [description], [map_embed_link]) VALUES (7, N'Suối Nước Nóng', CAST(15.00 AS Decimal(5, 2)), N'Điểm nghỉ dưỡng thiên nhiên', N'link_map_7')
INSERT [dbo].[Attractions] ([id], [name], [distance_km], [description], [map_embed_link]) VALUES (8, N'Làng Nghề Truyền Thống', CAST(12.00 AS Decimal(5, 2)), N'Trải nghiệm văn hóa bản địa', N'link_map_8')
INSERT [dbo].[Attractions] ([id], [name], [distance_km], [description], [map_embed_link]) VALUES (9, N'Trung Tâm Thương Mại', CAST(2.00 AS Decimal(5, 2)), N'Khu mua sắm cao cấp', N'link_map_9')
INSERT [dbo].[Attractions] ([id], [name], [distance_km], [description], [map_embed_link]) VALUES (10, N'Điểm Ngắm Hoàng Hôn', CAST(4.00 AS Decimal(5, 2)), N'Nơi có view biển đẹp nhất', N'link_map_10')
SET IDENTITY_INSERT [dbo].[Attractions] OFF
GO
SET IDENTITY_INSERT [dbo].[Audit_Logs] ON 

INSERT [dbo].[Audit_Logs] ([id], [user_id], [action], [table_name], [record_id], [old_value], [new_value], [created_at]) VALUES (1, 1, N'UPDATE', N'Rooms', 1, N'{"status":"Cleaning"}', N'{"status":"Available"}', CAST(N'2026-03-06T22:07:35.023' AS DateTime))
INSERT [dbo].[Audit_Logs] ([id], [user_id], [action], [table_name], [record_id], [old_value], [new_value], [created_at]) VALUES (2, 2, N'DELETE', N'Bookings', 5, N'{"id":5}', N'{}', CAST(N'2026-03-06T22:07:35.023' AS DateTime))
INSERT [dbo].[Audit_Logs] ([id], [user_id], [action], [table_name], [record_id], [old_value], [new_value], [created_at]) VALUES (3, 3, N'CREATE', N'Invoices', 1, N'{}', N'{"id":1}', CAST(N'2026-03-06T22:07:35.023' AS DateTime))
INSERT [dbo].[Audit_Logs] ([id], [user_id], [action], [table_name], [record_id], [old_value], [new_value], [created_at]) VALUES (4, 1, N'UPDATE', N'Users', 6, N'{"status":0}', N'{"status":1}', CAST(N'2026-03-06T22:07:35.023' AS DateTime))
INSERT [dbo].[Audit_Logs] ([id], [user_id], [action], [table_name], [record_id], [old_value], [new_value], [created_at]) VALUES (5, 2, N'CREATE', N'Services', 1, N'{}', N'{"price":200000}', CAST(N'2026-03-06T22:07:35.023' AS DateTime))
INSERT [dbo].[Audit_Logs] ([id], [user_id], [action], [table_name], [record_id], [old_value], [new_value], [created_at]) VALUES (6, 3, N'UPDATE', N'Bookings', 2, N'{"status":"Pending"}', N'{"status":"Checked_in"}', CAST(N'2026-03-06T22:07:35.023' AS DateTime))
INSERT [dbo].[Audit_Logs] ([id], [user_id], [action], [table_name], [record_id], [old_value], [new_value], [created_at]) VALUES (7, 1, N'UPDATE', N'Room_Types', 1, N'{"price":350000}', N'{"price":400000}', CAST(N'2026-03-06T22:07:35.023' AS DateTime))
INSERT [dbo].[Audit_Logs] ([id], [user_id], [action], [table_name], [record_id], [old_value], [new_value], [created_at]) VALUES (8, 2, N'DELETE', N'Reviews', 8, N'{"id":8}', N'{}', CAST(N'2026-03-06T22:07:35.023' AS DateTime))
INSERT [dbo].[Audit_Logs] ([id], [user_id], [action], [table_name], [record_id], [old_value], [new_value], [created_at]) VALUES (9, 3, N'CREATE', N'Order_Services', 1, N'{}', N'{"amount":300000}', CAST(N'2026-03-06T22:07:35.023' AS DateTime))
INSERT [dbo].[Audit_Logs] ([id], [user_id], [action], [table_name], [record_id], [old_value], [new_value], [created_at]) VALUES (10, 1, N'UPDATE', N'Vouchers', 1, N'{"limit":50}', N'{"limit":100}', CAST(N'2026-03-06T22:07:35.023' AS DateTime))
SET IDENTITY_INSERT [dbo].[Audit_Logs] OFF
GO
SET IDENTITY_INSERT [dbo].[Booking_Details] ON 

INSERT [dbo].[Booking_Details] ([id], [booking_id], [room_id], [room_type_id], [check_in_date], [check_out_date], [price_per_night]) VALUES (1, 1, 1, 1, CAST(N'2026-03-01T00:00:00.000' AS DateTime), CAST(N'2026-03-03T00:00:00.000' AS DateTime), CAST(400000.00 AS Decimal(18, 2)))
INSERT [dbo].[Booking_Details] ([id], [booking_id], [room_id], [room_type_id], [check_in_date], [check_out_date], [price_per_night]) VALUES (2, 2, 2, 2, CAST(N'2026-03-05T00:00:00.000' AS DateTime), CAST(N'2026-03-10T00:00:00.000' AS DateTime), CAST(500000.00 AS Decimal(18, 2)))
INSERT [dbo].[Booking_Details] ([id], [booking_id], [room_id], [room_type_id], [check_in_date], [check_out_date], [price_per_night]) VALUES (3, 3, NULL, 3, CAST(N'2026-04-10T00:00:00.000' AS DateTime), CAST(N'2026-04-12T00:00:00.000' AS DateTime), CAST(700000.00 AS Decimal(18, 2)))
INSERT [dbo].[Booking_Details] ([id], [booking_id], [room_id], [room_type_id], [check_in_date], [check_out_date], [price_per_night]) VALUES (4, 4, NULL, 4, CAST(N'2026-05-01T00:00:00.000' AS DateTime), CAST(N'2026-05-05T00:00:00.000' AS DateTime), CAST(900000.00 AS Decimal(18, 2)))
INSERT [dbo].[Booking_Details] ([id], [booking_id], [room_id], [room_type_id], [check_in_date], [check_out_date], [price_per_night]) VALUES (5, 5, NULL, 5, CAST(N'2026-03-15T00:00:00.000' AS DateTime), CAST(N'2026-03-16T00:00:00.000' AS DateTime), CAST(1200000.00 AS Decimal(18, 2)))
INSERT [dbo].[Booking_Details] ([id], [booking_id], [room_id], [room_type_id], [check_in_date], [check_out_date], [price_per_night]) VALUES (6, 6, 6, 6, CAST(N'2026-02-10T00:00:00.000' AS DateTime), CAST(N'2026-02-12T00:00:00.000' AS DateTime), CAST(1500000.00 AS Decimal(18, 2)))
INSERT [dbo].[Booking_Details] ([id], [booking_id], [room_id], [room_type_id], [check_in_date], [check_out_date], [price_per_night]) VALUES (7, 7, 7, 7, CAST(N'2026-03-07T00:00:00.000' AS DateTime), CAST(N'2026-03-09T00:00:00.000' AS DateTime), CAST(1800000.00 AS Decimal(18, 2)))
INSERT [dbo].[Booking_Details] ([id], [booking_id], [room_id], [room_type_id], [check_in_date], [check_out_date], [price_per_night]) VALUES (8, 8, NULL, 8, CAST(N'2026-06-01T00:00:00.000' AS DateTime), CAST(N'2026-06-05T00:00:00.000' AS DateTime), CAST(2500000.00 AS Decimal(18, 2)))
INSERT [dbo].[Booking_Details] ([id], [booking_id], [room_id], [room_type_id], [check_in_date], [check_out_date], [price_per_night]) VALUES (9, 9, 9, 9, CAST(N'2026-01-20T00:00:00.000' AS DateTime), CAST(N'2026-01-25T00:00:00.000' AS DateTime), CAST(5000000.00 AS Decimal(18, 2)))
INSERT [dbo].[Booking_Details] ([id], [booking_id], [room_id], [room_type_id], [check_in_date], [check_out_date], [price_per_night]) VALUES (10, 10, 10, 10, CAST(N'2026-03-06T00:00:00.000' AS DateTime), CAST(N'2026-03-08T00:00:00.000' AS DateTime), CAST(8000000.00 AS Decimal(18, 2)))
SET IDENTITY_INSERT [dbo].[Booking_Details] OFF
GO
SET IDENTITY_INSERT [dbo].[Bookings] ON 

INSERT [dbo].[Bookings] ([id], [user_id], [guest_name], [guest_phone], [guest_email], [booking_code], [voucher_id], [status]) VALUES (1, 6, N'Khách Hàng A', N'0900000006', NULL, N'BK-0001', NULL, N'Completed')
INSERT [dbo].[Bookings] ([id], [user_id], [guest_name], [guest_phone], [guest_email], [booking_code], [voucher_id], [status]) VALUES (2, 7, N'Khách Hàng B', N'0900000007', NULL, N'BK-0002', 1, N'Checked_in')
INSERT [dbo].[Bookings] ([id], [user_id], [guest_name], [guest_phone], [guest_email], [booking_code], [voucher_id], [status]) VALUES (3, 8, N'Khách Hàng C', N'0900000008', NULL, N'BK-0003', NULL, N'Confirmed')
INSERT [dbo].[Bookings] ([id], [user_id], [guest_name], [guest_phone], [guest_email], [booking_code], [voucher_id], [status]) VALUES (4, 9, N'Khách Hàng D', N'0900000009', NULL, N'BK-0004', 2, N'Pending')
INSERT [dbo].[Bookings] ([id], [user_id], [guest_name], [guest_phone], [guest_email], [booking_code], [voucher_id], [status]) VALUES (5, 10, N'Khách Hàng E', N'0900000010', NULL, N'BK-0005', NULL, N'Cancelled')
INSERT [dbo].[Bookings] ([id], [user_id], [guest_name], [guest_phone], [guest_email], [booking_code], [voucher_id], [status]) VALUES (6, NULL, N'Khách Vãng Lai 1', N'0911111111', NULL, N'BK-0006', NULL, N'Completed')
INSERT [dbo].[Bookings] ([id], [user_id], [guest_name], [guest_phone], [guest_email], [booking_code], [voucher_id], [status]) VALUES (7, NULL, N'Khách Vãng Lai 2', N'0922222222', NULL, N'BK-0007', 3, N'Checked_in')
INSERT [dbo].[Bookings] ([id], [user_id], [guest_name], [guest_phone], [guest_email], [booking_code], [voucher_id], [status]) VALUES (8, 6, N'Khách Hàng A', N'0900000006', NULL, N'BK-0008', NULL, N'Confirmed')
INSERT [dbo].[Bookings] ([id], [user_id], [guest_name], [guest_phone], [guest_email], [booking_code], [voucher_id], [status]) VALUES (9, 7, N'Khách Hàng B', N'0900000007', NULL, N'BK-0009', NULL, N'Completed')
INSERT [dbo].[Bookings] ([id], [user_id], [guest_name], [guest_phone], [guest_email], [booking_code], [voucher_id], [status]) VALUES (10, 8, N'Khách Hàng C', N'0900000008', NULL, N'BK-0010', 4, N'Checked_in')
SET IDENTITY_INSERT [dbo].[Bookings] OFF
GO
SET IDENTITY_INSERT [dbo].[Invoices] ON 

INSERT [dbo].[Invoices] ([id], [booking_id], [total_room_amount], [total_service_amount], [discount_amount], [tax_amount], [final_total], [status]) VALUES (1, 1, CAST(800000.00 AS Decimal(18, 2)), CAST(0.00 AS Decimal(18, 2)), CAST(0.00 AS Decimal(18, 2)), CAST(80000.00 AS Decimal(18, 2)), CAST(880000.00 AS Decimal(18, 2)), N'Paid')
INSERT [dbo].[Invoices] ([id], [booking_id], [total_room_amount], [total_service_amount], [discount_amount], [tax_amount], [final_total], [status]) VALUES (2, 2, CAST(2500000.00 AS Decimal(18, 2)), CAST(200000.00 AS Decimal(18, 2)), CAST(250000.00 AS Decimal(18, 2)), CAST(245000.00 AS Decimal(18, 2)), CAST(2695000.00 AS Decimal(18, 2)), N'Unpaid')
INSERT [dbo].[Invoices] ([id], [booking_id], [total_room_amount], [total_service_amount], [discount_amount], [tax_amount], [final_total], [status]) VALUES (3, 3, CAST(1400000.00 AS Decimal(18, 2)), CAST(0.00 AS Decimal(18, 2)), CAST(0.00 AS Decimal(18, 2)), CAST(140000.00 AS Decimal(18, 2)), CAST(1540000.00 AS Decimal(18, 2)), N'Unpaid')
INSERT [dbo].[Invoices] ([id], [booking_id], [total_room_amount], [total_service_amount], [discount_amount], [tax_amount], [final_total], [status]) VALUES (4, 4, CAST(3600000.00 AS Decimal(18, 2)), CAST(0.00 AS Decimal(18, 2)), CAST(100000.00 AS Decimal(18, 2)), CAST(350000.00 AS Decimal(18, 2)), CAST(3850000.00 AS Decimal(18, 2)), N'Unpaid')
INSERT [dbo].[Invoices] ([id], [booking_id], [total_room_amount], [total_service_amount], [discount_amount], [tax_amount], [final_total], [status]) VALUES (5, 5, CAST(1200000.00 AS Decimal(18, 2)), CAST(0.00 AS Decimal(18, 2)), CAST(0.00 AS Decimal(18, 2)), CAST(120000.00 AS Decimal(18, 2)), CAST(1320000.00 AS Decimal(18, 2)), N'Refunded')
INSERT [dbo].[Invoices] ([id], [booking_id], [total_room_amount], [total_service_amount], [discount_amount], [tax_amount], [final_total], [status]) VALUES (6, 6, CAST(3000000.00 AS Decimal(18, 2)), CAST(500000.00 AS Decimal(18, 2)), CAST(0.00 AS Decimal(18, 2)), CAST(350000.00 AS Decimal(18, 2)), CAST(3850000.00 AS Decimal(18, 2)), N'Paid')
INSERT [dbo].[Invoices] ([id], [booking_id], [total_room_amount], [total_service_amount], [discount_amount], [tax_amount], [final_total], [status]) VALUES (7, 7, CAST(3600000.00 AS Decimal(18, 2)), CAST(0.00 AS Decimal(18, 2)), CAST(540000.00 AS Decimal(18, 2)), CAST(306000.00 AS Decimal(18, 2)), CAST(3366000.00 AS Decimal(18, 2)), N'Unpaid')
INSERT [dbo].[Invoices] ([id], [booking_id], [total_room_amount], [total_service_amount], [discount_amount], [tax_amount], [final_total], [status]) VALUES (8, 8, CAST(10000000.00 AS Decimal(18, 2)), CAST(0.00 AS Decimal(18, 2)), CAST(0.00 AS Decimal(18, 2)), CAST(1000000.00 AS Decimal(18, 2)), CAST(11000000.00 AS Decimal(18, 2)), N'Unpaid')
INSERT [dbo].[Invoices] ([id], [booking_id], [total_room_amount], [total_service_amount], [discount_amount], [tax_amount], [final_total], [status]) VALUES (9, 9, CAST(25000000.00 AS Decimal(18, 2)), CAST(1000000.00 AS Decimal(18, 2)), CAST(0.00 AS Decimal(18, 2)), CAST(2600000.00 AS Decimal(18, 2)), CAST(28600000.00 AS Decimal(18, 2)), N'Paid')
INSERT [dbo].[Invoices] ([id], [booking_id], [total_room_amount], [total_service_amount], [discount_amount], [tax_amount], [final_total], [status]) VALUES (10, 10, CAST(16000000.00 AS Decimal(18, 2)), CAST(0.00 AS Decimal(18, 2)), CAST(200000.00 AS Decimal(18, 2)), CAST(1580000.00 AS Decimal(18, 2)), CAST(17380000.00 AS Decimal(18, 2)), N'Unpaid')
SET IDENTITY_INSERT [dbo].[Invoices] OFF
GO
SET IDENTITY_INSERT [dbo].[Loss_And_Damages] ON 

INSERT [dbo].[Loss_And_Damages] ([id], [booking_detail_id], [room_inventory_id], [quantity], [penalty_amount], [description], [created_at]) VALUES (1, 1, 2, 1, CAST(300000.00 AS Decimal(18, 2)), N'Làm mất điều khiển tivi', CAST(N'2026-03-06T22:07:35.030' AS DateTime))
INSERT [dbo].[Loss_And_Damages] ([id], [booking_detail_id], [room_inventory_id], [quantity], [penalty_amount], [description], [created_at]) VALUES (2, 2, 4, 1, CAST(50000.00 AS Decimal(18, 2)), N'Làm vỡ cốc thủy tinh', CAST(N'2026-03-06T22:07:35.030' AS DateTime))
INSERT [dbo].[Loss_And_Damages] ([id], [booking_detail_id], [room_inventory_id], [quantity], [penalty_amount], [description], [created_at]) VALUES (3, 6, 3, 1, CAST(400000.00 AS Decimal(18, 2)), N'Làm hỏng bình đun siêu tốc', CAST(N'2026-03-06T22:07:35.030' AS DateTime))
INSERT [dbo].[Loss_And_Damages] ([id], [booking_detail_id], [room_inventory_id], [quantity], [penalty_amount], [description], [created_at]) VALUES (4, 9, 6, 1, CAST(350000.00 AS Decimal(18, 2)), N'Mất máy sấy tóc', CAST(N'2026-03-06T22:07:35.030' AS DateTime))
INSERT [dbo].[Loss_And_Damages] ([id], [booking_detail_id], [room_inventory_id], [quantity], [penalty_amount], [description], [created_at]) VALUES (5, 10, 8, 2, CAST(40000.00 AS Decimal(18, 2)), N'Gãy móc treo quần áo', CAST(N'2026-03-06T22:07:35.030' AS DateTime))
INSERT [dbo].[Loss_And_Damages] ([id], [booking_detail_id], [room_inventory_id], [quantity], [penalty_amount], [description], [created_at]) VALUES (6, 1, 10, 1, CAST(100000.00 AS Decimal(18, 2)), N'Làm bẩn thảm lau chân không giặt được', CAST(N'2026-03-06T22:07:35.030' AS DateTime))
INSERT [dbo].[Loss_And_Damages] ([id], [booking_detail_id], [room_inventory_id], [quantity], [penalty_amount], [description], [created_at]) VALUES (7, 2, 7, 1, CAST(250000.00 AS Decimal(18, 2)), N'Làm cháy gối nằm', CAST(N'2026-03-06T22:07:35.030' AS DateTime))
INSERT [dbo].[Loss_And_Damages] ([id], [booking_detail_id], [room_inventory_id], [quantity], [penalty_amount], [description], [created_at]) VALUES (8, 6, 5, 1, CAST(450000.00 AS Decimal(18, 2)), N'Mất áo choàng tắm', CAST(N'2026-03-06T22:07:35.030' AS DateTime))
INSERT [dbo].[Loss_And_Damages] ([id], [booking_detail_id], [room_inventory_id], [quantity], [penalty_amount], [description], [created_at]) VALUES (9, 9, 4, 2, CAST(100000.00 AS Decimal(18, 2)), N'Vỡ 2 cốc thủy tinh', CAST(N'2026-03-06T22:07:35.030' AS DateTime))
INSERT [dbo].[Loss_And_Damages] ([id], [booking_detail_id], [room_inventory_id], [quantity], [penalty_amount], [description], [created_at]) VALUES (10, 10, 2, 1, CAST(300000.00 AS Decimal(18, 2)), N'Làm rơi vỡ điều khiển tivi', CAST(N'2026-03-06T22:07:35.030' AS DateTime))
SET IDENTITY_INSERT [dbo].[Loss_And_Damages] OFF
GO
SET IDENTITY_INSERT [dbo].[Memberships] ON 

INSERT [dbo].[Memberships] ([id], [tier_name], [min_points], [discount_percent]) VALUES (1, N'Khách Mới', 0, CAST(0.00 AS Decimal(5, 2)))
INSERT [dbo].[Memberships] ([id], [tier_name], [min_points], [discount_percent]) VALUES (2, N'Đồng', 500, CAST(2.00 AS Decimal(5, 2)))
INSERT [dbo].[Memberships] ([id], [tier_name], [min_points], [discount_percent]) VALUES (3, N'Bạc', 1000, CAST(5.00 AS Decimal(5, 2)))
INSERT [dbo].[Memberships] ([id], [tier_name], [min_points], [discount_percent]) VALUES (4, N'Vàng', 3000, CAST(8.00 AS Decimal(5, 2)))
INSERT [dbo].[Memberships] ([id], [tier_name], [min_points], [discount_percent]) VALUES (5, N'Bạch Kim', 5000, CAST(10.00 AS Decimal(5, 2)))
INSERT [dbo].[Memberships] ([id], [tier_name], [min_points], [discount_percent]) VALUES (6, N'Kim Cương', 10000, CAST(15.00 AS Decimal(5, 2)))
INSERT [dbo].[Memberships] ([id], [tier_name], [min_points], [discount_percent]) VALUES (7, N'Elite', 20000, CAST(20.00 AS Decimal(5, 2)))
INSERT [dbo].[Memberships] ([id], [tier_name], [min_points], [discount_percent]) VALUES (8, N'VIP', 50000, CAST(25.00 AS Decimal(5, 2)))
INSERT [dbo].[Memberships] ([id], [tier_name], [min_points], [discount_percent]) VALUES (9, N'VVIP', 100000, CAST(30.00 AS Decimal(5, 2)))
INSERT [dbo].[Memberships] ([id], [tier_name], [min_points], [discount_percent]) VALUES (10, N'Signature', 200000, CAST(35.00 AS Decimal(5, 2)))
SET IDENTITY_INSERT [dbo].[Memberships] OFF
GO
SET IDENTITY_INSERT [dbo].[Order_Service_Details] ON 

INSERT [dbo].[Order_Service_Details] ([id], [order_service_id], [service_id], [quantity], [unit_price]) VALUES (1, 2, 2, 1, CAST(150000.00 AS Decimal(18, 2)))
INSERT [dbo].[Order_Service_Details] ([id], [order_service_id], [service_id], [quantity], [unit_price]) VALUES (2, 2, 10, 1, CAST(50000.00 AS Decimal(18, 2)))
INSERT [dbo].[Order_Service_Details] ([id], [order_service_id], [service_id], [quantity], [unit_price]) VALUES (3, 4, 3, 1, CAST(500000.00 AS Decimal(18, 2)))
INSERT [dbo].[Order_Service_Details] ([id], [order_service_id], [service_id], [quantity], [unit_price]) VALUES (4, 6, 5, 1, CAST(350000.00 AS Decimal(18, 2)))
INSERT [dbo].[Order_Service_Details] ([id], [order_service_id], [service_id], [quantity], [unit_price]) VALUES (5, 7, 9, 1, CAST(800000.00 AS Decimal(18, 2)))
INSERT [dbo].[Order_Service_Details] ([id], [order_service_id], [service_id], [quantity], [unit_price]) VALUES (6, 9, 1, 5, CAST(200000.00 AS Decimal(18, 2)))
INSERT [dbo].[Order_Service_Details] ([id], [order_service_id], [service_id], [quantity], [unit_price]) VALUES (7, 10, 2, 1, CAST(150000.00 AS Decimal(18, 2)))
INSERT [dbo].[Order_Service_Details] ([id], [order_service_id], [service_id], [quantity], [unit_price]) VALUES (8, 4, 8, 2, CAST(40000.00 AS Decimal(18, 2)))
INSERT [dbo].[Order_Service_Details] ([id], [order_service_id], [service_id], [quantity], [unit_price]) VALUES (9, 6, 10, 2, CAST(50000.00 AS Decimal(18, 2)))
INSERT [dbo].[Order_Service_Details] ([id], [order_service_id], [service_id], [quantity], [unit_price]) VALUES (10, 7, 6, 2, CAST(100000.00 AS Decimal(18, 2)))
SET IDENTITY_INSERT [dbo].[Order_Service_Details] OFF
GO
SET IDENTITY_INSERT [dbo].[Order_Services] ON 

INSERT [dbo].[Order_Services] ([id], [booking_detail_id], [order_date], [total_amount], [status]) VALUES (1, 1, CAST(N'2026-03-06T22:07:35.027' AS DateTime), CAST(0.00 AS Decimal(18, 2)), N'Cancelled')
INSERT [dbo].[Order_Services] ([id], [booking_detail_id], [order_date], [total_amount], [status]) VALUES (2, 2, CAST(N'2026-03-06T22:07:35.027' AS DateTime), CAST(200000.00 AS Decimal(18, 2)), N'Delivered')
INSERT [dbo].[Order_Services] ([id], [booking_detail_id], [order_date], [total_amount], [status]) VALUES (3, 3, CAST(N'2026-03-06T22:07:35.027' AS DateTime), CAST(0.00 AS Decimal(18, 2)), N'Pending')
INSERT [dbo].[Order_Services] ([id], [booking_detail_id], [order_date], [total_amount], [status]) VALUES (4, 4, CAST(N'2026-03-06T22:07:35.027' AS DateTime), CAST(500000.00 AS Decimal(18, 2)), N'Delivered')
INSERT [dbo].[Order_Services] ([id], [booking_detail_id], [order_date], [total_amount], [status]) VALUES (5, 5, CAST(N'2026-03-06T22:07:35.027' AS DateTime), CAST(0.00 AS Decimal(18, 2)), N'Pending')
INSERT [dbo].[Order_Services] ([id], [booking_detail_id], [order_date], [total_amount], [status]) VALUES (6, 6, CAST(N'2026-03-06T22:07:35.027' AS DateTime), CAST(350000.00 AS Decimal(18, 2)), N'Delivered')
INSERT [dbo].[Order_Services] ([id], [booking_detail_id], [order_date], [total_amount], [status]) VALUES (7, 7, CAST(N'2026-03-06T22:07:35.027' AS DateTime), CAST(800000.00 AS Decimal(18, 2)), N'Delivered')
INSERT [dbo].[Order_Services] ([id], [booking_detail_id], [order_date], [total_amount], [status]) VALUES (8, 8, CAST(N'2026-03-06T22:07:35.027' AS DateTime), CAST(0.00 AS Decimal(18, 2)), N'Pending')
INSERT [dbo].[Order_Services] ([id], [booking_detail_id], [order_date], [total_amount], [status]) VALUES (9, 9, CAST(N'2026-03-06T22:07:35.027' AS DateTime), CAST(1000000.00 AS Decimal(18, 2)), N'Delivered')
INSERT [dbo].[Order_Services] ([id], [booking_detail_id], [order_date], [total_amount], [status]) VALUES (10, 10, CAST(N'2026-03-06T22:07:35.027' AS DateTime), CAST(150000.00 AS Decimal(18, 2)), N'Delivered')
SET IDENTITY_INSERT [dbo].[Order_Services] OFF
GO
SET IDENTITY_INSERT [dbo].[Payments] ON 

INSERT [dbo].[Payments] ([id], [invoice_id], [payment_method], [amount_paid], [transaction_code], [payment_date]) VALUES (1, 1, N'Cash', CAST(880000.00 AS Decimal(18, 2)), N'CASH001', CAST(N'2026-03-06T22:07:35.027' AS DateTime))
INSERT [dbo].[Payments] ([id], [invoice_id], [payment_method], [amount_paid], [transaction_code], [payment_date]) VALUES (2, 2, N'VNPay', CAST(1000000.00 AS Decimal(18, 2)), N'VNPAY123', CAST(N'2026-03-06T22:07:35.027' AS DateTime))
INSERT [dbo].[Payments] ([id], [invoice_id], [payment_method], [amount_paid], [transaction_code], [payment_date]) VALUES (3, 3, N'Credit Card', CAST(500000.00 AS Decimal(18, 2)), N'CC456', CAST(N'2026-03-06T22:07:35.027' AS DateTime))
INSERT [dbo].[Payments] ([id], [invoice_id], [payment_method], [amount_paid], [transaction_code], [payment_date]) VALUES (4, 4, N'Momo', CAST(3850000.00 AS Decimal(18, 2)), N'MOMO789', CAST(N'2026-03-06T22:07:35.027' AS DateTime))
INSERT [dbo].[Payments] ([id], [invoice_id], [payment_method], [amount_paid], [transaction_code], [payment_date]) VALUES (5, 5, N'Bank Transfer', CAST(1320000.00 AS Decimal(18, 2)), N'BANK001', CAST(N'2026-03-06T22:07:35.027' AS DateTime))
INSERT [dbo].[Payments] ([id], [invoice_id], [payment_method], [amount_paid], [transaction_code], [payment_date]) VALUES (6, 6, N'Cash', CAST(3850000.00 AS Decimal(18, 2)), N'CASH002', CAST(N'2026-03-06T22:07:35.027' AS DateTime))
INSERT [dbo].[Payments] ([id], [invoice_id], [payment_method], [amount_paid], [transaction_code], [payment_date]) VALUES (7, 7, N'VNPay', CAST(3366000.00 AS Decimal(18, 2)), N'VNPAY999', CAST(N'2026-03-06T22:07:35.027' AS DateTime))
INSERT [dbo].[Payments] ([id], [invoice_id], [payment_method], [amount_paid], [transaction_code], [payment_date]) VALUES (8, 8, N'Credit Card', CAST(11000000.00 AS Decimal(18, 2)), N'CC888', CAST(N'2026-03-06T22:07:35.027' AS DateTime))
INSERT [dbo].[Payments] ([id], [invoice_id], [payment_method], [amount_paid], [transaction_code], [payment_date]) VALUES (9, 9, N'Bank Transfer', CAST(28600000.00 AS Decimal(18, 2)), N'BANK002', CAST(N'2026-03-06T22:07:35.027' AS DateTime))
INSERT [dbo].[Payments] ([id], [invoice_id], [payment_method], [amount_paid], [transaction_code], [payment_date]) VALUES (10, 10, N'Momo', CAST(5000000.00 AS Decimal(18, 2)), N'MOMO111', CAST(N'2026-03-06T22:07:35.027' AS DateTime))
SET IDENTITY_INSERT [dbo].[Payments] OFF
GO
SET IDENTITY_INSERT [dbo].[Permissions] ON 

INSERT [dbo].[Permissions] ([id], [name]) VALUES (1, N'VIEW_DASHBOARD')
INSERT [dbo].[Permissions] ([id], [name]) VALUES (2, N'MANAGE_USERS')
INSERT [dbo].[Permissions] ([id], [name]) VALUES (3, N'MANAGE_ROLES')
INSERT [dbo].[Permissions] ([id], [name]) VALUES (4, N'MANAGE_ROOMS')
INSERT [dbo].[Permissions] ([id], [name]) VALUES (5, N'MANAGE_BOOKINGS')
INSERT [dbo].[Permissions] ([id], [name]) VALUES (6, N'MANAGE_INVOICES')
INSERT [dbo].[Permissions] ([id], [name]) VALUES (7, N'MANAGE_SERVICES')
INSERT [dbo].[Permissions] ([id], [name]) VALUES (8, N'VIEW_REPORTS')
INSERT [dbo].[Permissions] ([id], [name]) VALUES (9, N'MANAGE_CONTENT')
INSERT [dbo].[Permissions] ([id], [name]) VALUES (10, N'MANAGE_INVENTORY')
SET IDENTITY_INSERT [dbo].[Permissions] OFF
GO
SET IDENTITY_INSERT [dbo].[Reviews] ON 

INSERT [dbo].[Reviews] ([id], [user_id], [room_type_id], [rating], [comment], [created_at]) VALUES (1, 6, 1, 5, N'Phòng tuyệt vời!', CAST(N'2026-03-06T22:07:35.023' AS DateTime))
INSERT [dbo].[Reviews] ([id], [user_id], [room_type_id], [rating], [comment], [created_at]) VALUES (2, 7, 2, 4, N'Khá tốt, nhân viên thân thiện.', CAST(N'2026-03-06T22:07:35.023' AS DateTime))
INSERT [dbo].[Reviews] ([id], [user_id], [room_type_id], [rating], [comment], [created_at]) VALUES (3, 8, 3, 3, N'Bình thường, điều hòa hơi ồn.', CAST(N'2026-03-06T22:07:35.023' AS DateTime))
INSERT [dbo].[Reviews] ([id], [user_id], [room_type_id], [rating], [comment], [created_at]) VALUES (4, 9, 4, 5, N'View biển rất đẹp.', CAST(N'2026-03-06T22:07:35.023' AS DateTime))
INSERT [dbo].[Reviews] ([id], [user_id], [room_type_id], [rating], [comment], [created_at]) VALUES (5, 10, 5, 4, N'Bữa sáng ngon miệng.', CAST(N'2026-03-06T22:07:35.023' AS DateTime))
INSERT [dbo].[Reviews] ([id], [user_id], [room_type_id], [rating], [comment], [created_at]) VALUES (6, 6, 6, 5, N'Rất thích hợp cho gia đình.', CAST(N'2026-03-06T22:07:35.023' AS DateTime))
INSERT [dbo].[Reviews] ([id], [user_id], [room_type_id], [rating], [comment], [created_at]) VALUES (7, 7, 7, 5, N'Sang trọng, đẳng cấp.', CAST(N'2026-03-06T22:07:35.023' AS DateTime))
INSERT [dbo].[Reviews] ([id], [user_id], [room_type_id], [rating], [comment], [created_at]) VALUES (8, 8, 8, 2, N'Chưa hài lòng với dịch vụ dọn phòng.', CAST(N'2026-03-06T22:07:35.023' AS DateTime))
INSERT [dbo].[Reviews] ([id], [user_id], [room_type_id], [rating], [comment], [created_at]) VALUES (9, 9, 9, 5, N'Hoàn hảo mọi mặt.', CAST(N'2026-03-06T22:07:35.023' AS DateTime))
INSERT [dbo].[Reviews] ([id], [user_id], [room_type_id], [rating], [comment], [created_at]) VALUES (10, 10, 10, 5, N'Trải nghiệm tuyệt vời nhất.', CAST(N'2026-03-06T22:07:35.023' AS DateTime))
SET IDENTITY_INSERT [dbo].[Reviews] OFF
GO
INSERT [dbo].[Role_Permissions] ([role_id], [permission_id]) VALUES (1, 1)
INSERT [dbo].[Role_Permissions] ([role_id], [permission_id]) VALUES (1, 2)
INSERT [dbo].[Role_Permissions] ([role_id], [permission_id]) VALUES (1, 3)
INSERT [dbo].[Role_Permissions] ([role_id], [permission_id]) VALUES (1, 4)
INSERT [dbo].[Role_Permissions] ([role_id], [permission_id]) VALUES (1, 5)
INSERT [dbo].[Role_Permissions] ([role_id], [permission_id]) VALUES (2, 1)
INSERT [dbo].[Role_Permissions] ([role_id], [permission_id]) VALUES (2, 4)
INSERT [dbo].[Role_Permissions] ([role_id], [permission_id]) VALUES (2, 5)
INSERT [dbo].[Role_Permissions] ([role_id], [permission_id]) VALUES (3, 1)
INSERT [dbo].[Role_Permissions] ([role_id], [permission_id]) VALUES (3, 5)
GO
SET IDENTITY_INSERT [dbo].[Roles] ON 

INSERT [dbo].[Roles] ([id], [name], [description]) VALUES (1, N'Admin', N'Quản trị viên')
INSERT [dbo].[Roles] ([id], [name], [description]) VALUES (2, N'Manager', N'Quản lý khách sạn')
INSERT [dbo].[Roles] ([id], [name], [description]) VALUES (3, N'Receptionist', N'Lễ tân')
INSERT [dbo].[Roles] ([id], [name], [description]) VALUES (4, N'Accountant', N'Kế toán')
INSERT [dbo].[Roles] ([id], [name], [description]) VALUES (5, N'Housekeeping', N'Buồng phòng')
INSERT [dbo].[Roles] ([id], [name], [description]) VALUES (6, N'Security', N'Bảo vệ')
INSERT [dbo].[Roles] ([id], [name], [description]) VALUES (7, N'Chef', N'Đầu bếp')
INSERT [dbo].[Roles] ([id], [name], [description]) VALUES (8, N'Waiter', N'Nhân viên phục vụ')
INSERT [dbo].[Roles] ([id], [name], [description]) VALUES (9, N'IT Support', N'Kỹ thuật viên')
INSERT [dbo].[Roles] ([id], [name], [description]) VALUES (10, N'Guest', N'Khách hàng')
SET IDENTITY_INSERT [dbo].[Roles] OFF
GO
SET IDENTITY_INSERT [dbo].[Room_Images] ON 

INSERT [dbo].[Room_Images] ([id], [room_type_id], [image_url], [is_primary]) VALUES (1, 1, N'type1_img.jpg', 1)
INSERT [dbo].[Room_Images] ([id], [room_type_id], [image_url], [is_primary]) VALUES (2, 2, N'type2_img.jpg', 1)
INSERT [dbo].[Room_Images] ([id], [room_type_id], [image_url], [is_primary]) VALUES (3, 3, N'type3_img.jpg', 1)
INSERT [dbo].[Room_Images] ([id], [room_type_id], [image_url], [is_primary]) VALUES (4, 4, N'type4_img.jpg', 1)
INSERT [dbo].[Room_Images] ([id], [room_type_id], [image_url], [is_primary]) VALUES (5, 5, N'type5_img.jpg', 1)
INSERT [dbo].[Room_Images] ([id], [room_type_id], [image_url], [is_primary]) VALUES (6, 6, N'type6_img.jpg', 1)
INSERT [dbo].[Room_Images] ([id], [room_type_id], [image_url], [is_primary]) VALUES (7, 7, N'type7_img.jpg', 1)
INSERT [dbo].[Room_Images] ([id], [room_type_id], [image_url], [is_primary]) VALUES (8, 8, N'type8_img.jpg', 1)
INSERT [dbo].[Room_Images] ([id], [room_type_id], [image_url], [is_primary]) VALUES (9, 9, N'type9_img.jpg', 1)
INSERT [dbo].[Room_Images] ([id], [room_type_id], [image_url], [is_primary]) VALUES (10, 10, N'type10_img.jpg', 1)
SET IDENTITY_INSERT [dbo].[Room_Images] OFF
GO
SET IDENTITY_INSERT [dbo].[Room_Inventory] ON 

INSERT [dbo].[Room_Inventory] ([id], [room_id], [item_name], [quantity], [price_if_lost]) VALUES (1, 1, N'Tivi Samsung 40 inch', 1, CAST(5000000.00 AS Decimal(18, 2)))
INSERT [dbo].[Room_Inventory] ([id], [room_id], [item_name], [quantity], [price_if_lost]) VALUES (2, 1, N'Điều Khiển Tivi', 1, CAST(300000.00 AS Decimal(18, 2)))
INSERT [dbo].[Room_Inventory] ([id], [room_id], [item_name], [quantity], [price_if_lost]) VALUES (3, 2, N'Khăn Tắm Lớn', 2, CAST(200000.00 AS Decimal(18, 2)))
INSERT [dbo].[Room_Inventory] ([id], [room_id], [item_name], [quantity], [price_if_lost]) VALUES (4, 2, N'Cốc Thủy Tinh', 2, CAST(50000.00 AS Decimal(18, 2)))
INSERT [dbo].[Room_Inventory] ([id], [room_id], [item_name], [quantity], [price_if_lost]) VALUES (5, 3, N'Bình Đun Siêu Tốc', 1, CAST(400000.00 AS Decimal(18, 2)))
INSERT [dbo].[Room_Inventory] ([id], [room_id], [item_name], [quantity], [price_if_lost]) VALUES (6, 3, N'Máy Sấy Tóc', 1, CAST(350000.00 AS Decimal(18, 2)))
INSERT [dbo].[Room_Inventory] ([id], [room_id], [item_name], [quantity], [price_if_lost]) VALUES (7, 4, N'Gối Nằm', 4, CAST(250000.00 AS Decimal(18, 2)))
INSERT [dbo].[Room_Inventory] ([id], [room_id], [item_name], [quantity], [price_if_lost]) VALUES (8, 4, N'Móc Treo Quần Áo', 10, CAST(20000.00 AS Decimal(18, 2)))
INSERT [dbo].[Room_Inventory] ([id], [room_id], [item_name], [quantity], [price_if_lost]) VALUES (9, 5, N'Áo Choàng Tắm', 2, CAST(450000.00 AS Decimal(18, 2)))
INSERT [dbo].[Room_Inventory] ([id], [room_id], [item_name], [quantity], [price_if_lost]) VALUES (10, 5, N'Thảm Lau Chân', 1, CAST(100000.00 AS Decimal(18, 2)))
SET IDENTITY_INSERT [dbo].[Room_Inventory] OFF
GO
SET IDENTITY_INSERT [dbo].[Room_Types] ON 

INSERT [dbo].[Room_Types] ([id], [name], [base_price], [capacity_adults], [capacity_children], [description]) VALUES (1, N'Standard Single', CAST(400000.00 AS Decimal(18, 2)), 1, 0, N'Phòng tiêu chuẩn 1 giường đơn')
INSERT [dbo].[Room_Types] ([id], [name], [base_price], [capacity_adults], [capacity_children], [description]) VALUES (2, N'Standard Double', CAST(500000.00 AS Decimal(18, 2)), 2, 1, N'Phòng tiêu chuẩn 1 giường đôi')
INSERT [dbo].[Room_Types] ([id], [name], [base_price], [capacity_adults], [capacity_children], [description]) VALUES (3, N'Superior City View', CAST(700000.00 AS Decimal(18, 2)), 2, 1, N'Phòng cao cấp hướng phố')
INSERT [dbo].[Room_Types] ([id], [name], [base_price], [capacity_adults], [capacity_children], [description]) VALUES (4, N'Deluxe Ocean View', CAST(900000.00 AS Decimal(18, 2)), 2, 2, N'Phòng Deluxe hướng biển')
INSERT [dbo].[Room_Types] ([id], [name], [base_price], [capacity_adults], [capacity_children], [description]) VALUES (5, N'Premium Deluxe', CAST(1200000.00 AS Decimal(18, 2)), 2, 2, N'Phòng Premium tiện nghi cao cấp')
INSERT [dbo].[Room_Types] ([id], [name], [base_price], [capacity_adults], [capacity_children], [description]) VALUES (6, N'Family Suite', CAST(1500000.00 AS Decimal(18, 2)), 4, 2, N'Phòng Suite cho gia đình')
INSERT [dbo].[Room_Types] ([id], [name], [base_price], [capacity_adults], [capacity_children], [description]) VALUES (7, N'Junior Suite', CAST(1800000.00 AS Decimal(18, 2)), 2, 2, N'Phòng Suite nhỏ nhắn sang trọng')
INSERT [dbo].[Room_Types] ([id], [name], [base_price], [capacity_adults], [capacity_children], [description]) VALUES (8, N'Executive Suite', CAST(2500000.00 AS Decimal(18, 2)), 2, 2, N'Phòng Suite cho doanh nhân')
INSERT [dbo].[Room_Types] ([id], [name], [base_price], [capacity_adults], [capacity_children], [description]) VALUES (9, N'Presidential Suite', CAST(5000000.00 AS Decimal(18, 2)), 4, 2, N'Phòng Tổng thống')
INSERT [dbo].[Room_Types] ([id], [name], [base_price], [capacity_adults], [capacity_children], [description]) VALUES (10, N'Royal Villa', CAST(8000000.00 AS Decimal(18, 2)), 6, 4, N'Biệt thự hoàng gia nguyên căn')
SET IDENTITY_INSERT [dbo].[Room_Types] OFF
GO
SET IDENTITY_INSERT [dbo].[Rooms] ON 

INSERT [dbo].[Rooms] ([id], [room_type_id], [room_number], [floor], [status]) VALUES (1, 1, N'101', 1, N'Available')
INSERT [dbo].[Rooms] ([id], [room_type_id], [room_number], [floor], [status]) VALUES (2, 2, N'102', 1, N'Occupied')
INSERT [dbo].[Rooms] ([id], [room_type_id], [room_number], [floor], [status]) VALUES (3, 3, N'201', 2, N'Cleaning')
INSERT [dbo].[Rooms] ([id], [room_type_id], [room_number], [floor], [status]) VALUES (4, 4, N'202', 2, N'Maintenance')
INSERT [dbo].[Rooms] ([id], [room_type_id], [room_number], [floor], [status]) VALUES (5, 5, N'301', 3, N'Available')
INSERT [dbo].[Rooms] ([id], [room_type_id], [room_number], [floor], [status]) VALUES (6, 6, N'302', 3, N'Occupied')
INSERT [dbo].[Rooms] ([id], [room_type_id], [room_number], [floor], [status]) VALUES (7, 7, N'401', 4, N'Available')
INSERT [dbo].[Rooms] ([id], [room_type_id], [room_number], [floor], [status]) VALUES (8, 8, N'402', 4, N'Available')
INSERT [dbo].[Rooms] ([id], [room_type_id], [room_number], [floor], [status]) VALUES (9, 9, N'501', 5, N'Available')
INSERT [dbo].[Rooms] ([id], [room_type_id], [room_number], [floor], [status]) VALUES (10, 10, N'VILLA-1', 1, N'Available')
SET IDENTITY_INSERT [dbo].[Rooms] OFF
GO
INSERT [dbo].[RoomType_Amenities] ([room_type_id], [amenity_id]) VALUES (1, 1)
INSERT [dbo].[RoomType_Amenities] ([room_type_id], [amenity_id]) VALUES (1, 2)
INSERT [dbo].[RoomType_Amenities] ([room_type_id], [amenity_id]) VALUES (1, 3)
INSERT [dbo].[RoomType_Amenities] ([room_type_id], [amenity_id]) VALUES (2, 1)
INSERT [dbo].[RoomType_Amenities] ([room_type_id], [amenity_id]) VALUES (2, 2)
INSERT [dbo].[RoomType_Amenities] ([room_type_id], [amenity_id]) VALUES (3, 4)
INSERT [dbo].[RoomType_Amenities] ([room_type_id], [amenity_id]) VALUES (3, 5)
INSERT [dbo].[RoomType_Amenities] ([room_type_id], [amenity_id]) VALUES (4, 6)
INSERT [dbo].[RoomType_Amenities] ([room_type_id], [amenity_id]) VALUES (4, 7)
INSERT [dbo].[RoomType_Amenities] ([room_type_id], [amenity_id]) VALUES (5, 8)
GO
SET IDENTITY_INSERT [dbo].[Service_Categories] ON 

INSERT [dbo].[Service_Categories] ([id], [name]) VALUES (1, N'Nhà Hàng & Ẩm Thực')
INSERT [dbo].[Service_Categories] ([id], [name]) VALUES (2, N'Spa & Massage')
INSERT [dbo].[Service_Categories] ([id], [name]) VALUES (3, N'Di Chuyển & Đưa Đón')
INSERT [dbo].[Service_Categories] ([id], [name]) VALUES (4, N'Giặt Ủi')
INSERT [dbo].[Service_Categories] ([id], [name]) VALUES (5, N'Tour Du Lịch')
INSERT [dbo].[Service_Categories] ([id], [name]) VALUES (6, N'Phòng Gym & Yoga')
INSERT [dbo].[Service_Categories] ([id], [name]) VALUES (7, N'Hồ Bơi')
INSERT [dbo].[Service_Categories] ([id], [name]) VALUES (8, N'Tổ Chức Sự Kiện')
INSERT [dbo].[Service_Categories] ([id], [name]) VALUES (9, N'Khu Vui Chơi Trẻ Em')
INSERT [dbo].[Service_Categories] ([id], [name]) VALUES (10, N'Cửa Hàng Lưu Niệm')
SET IDENTITY_INSERT [dbo].[Service_Categories] OFF
GO
SET IDENTITY_INSERT [dbo].[Services] ON 

INSERT [dbo].[Services] ([id], [category_id], [name], [price], [unit]) VALUES (1, 1, N'Set Ăn Sáng Buffet', CAST(200000.00 AS Decimal(18, 2)), N'Người')
INSERT [dbo].[Services] ([id], [category_id], [name], [price], [unit]) VALUES (2, 1, N'Mì Ý Hải Sản', CAST(150000.00 AS Decimal(18, 2)), N'Phần')
INSERT [dbo].[Services] ([id], [category_id], [name], [price], [unit]) VALUES (3, 2, N'Massage Toàn Thân 60p', CAST(500000.00 AS Decimal(18, 2)), N'Lượt')
INSERT [dbo].[Services] ([id], [category_id], [name], [price], [unit]) VALUES (4, 2, N'Xông Hơi Thảo Dược', CAST(300000.00 AS Decimal(18, 2)), N'Lượt')
INSERT [dbo].[Services] ([id], [category_id], [name], [price], [unit]) VALUES (5, 3, N'Đưa Đón Sân Bay 4 Chỗ', CAST(350000.00 AS Decimal(18, 2)), N'Chuyến')
INSERT [dbo].[Services] ([id], [category_id], [name], [price], [unit]) VALUES (6, 3, N'Thuê Xe Máy Nửa Ngày', CAST(100000.00 AS Decimal(18, 2)), N'Chiếc')
INSERT [dbo].[Services] ([id], [category_id], [name], [price], [unit]) VALUES (7, 4, N'Giặt Khô Áo Vest', CAST(120000.00 AS Decimal(18, 2)), N'Cái')
INSERT [dbo].[Services] ([id], [category_id], [name], [price], [unit]) VALUES (8, 4, N'Giặt Sấy Tiêu Chuẩn', CAST(40000.00 AS Decimal(18, 2)), N'Kg')
INSERT [dbo].[Services] ([id], [category_id], [name], [price], [unit]) VALUES (9, 5, N'Tour Đảo Nửa Ngày', CAST(800000.00 AS Decimal(18, 2)), N'Người')
INSERT [dbo].[Services] ([id], [category_id], [name], [price], [unit]) VALUES (10, 10, N'Móc Khóa Kỷ Niệm', CAST(50000.00 AS Decimal(18, 2)), N'Cái')
SET IDENTITY_INSERT [dbo].[Services] OFF
GO
SET IDENTITY_INSERT [dbo].[Users] ON 

INSERT [dbo].[Users] ([id], [role_id], [membership_id], [full_name], [email], [phone], [password_hash], [status]) VALUES (1, 1, NULL, N'Nguyễn Admin', N'admin@hotel.com', N'0900000001', N'hash1', 1)
INSERT [dbo].[Users] ([id], [role_id], [membership_id], [full_name], [email], [phone], [password_hash], [status]) VALUES (2, 2, NULL, N'Trần Manager', N'manager@hotel.com', N'0900000002', N'hash2', 1)
INSERT [dbo].[Users] ([id], [role_id], [membership_id], [full_name], [email], [phone], [password_hash], [status]) VALUES (3, 3, NULL, N'Lê Lễ Tân', N'reception1@hotel.com', N'0900000003', N'hash3', 1)
INSERT [dbo].[Users] ([id], [role_id], [membership_id], [full_name], [email], [phone], [password_hash], [status]) VALUES (4, 3, NULL, N'Phạm Lễ Tân', N'reception2@hotel.com', N'0900000004', N'hash4', 1)
INSERT [dbo].[Users] ([id], [role_id], [membership_id], [full_name], [email], [phone], [password_hash], [status]) VALUES (5, 4, NULL, N'Hoàng Kế Toán', N'accountant@hotel.com', N'0900000005', N'hash5', 1)
INSERT [dbo].[Users] ([id], [role_id], [membership_id], [full_name], [email], [phone], [password_hash], [status]) VALUES (6, 10, 1, N'Khách Hàng A', N'guestA@gmail.com', N'0900000006', N'hash6', 1)
INSERT [dbo].[Users] ([id], [role_id], [membership_id], [full_name], [email], [phone], [password_hash], [status]) VALUES (7, 10, 2, N'Khách Hàng B', N'guestB@gmail.com', N'0900000007', N'hash7', 1)
INSERT [dbo].[Users] ([id], [role_id], [membership_id], [full_name], [email], [phone], [password_hash], [status]) VALUES (8, 10, 3, N'Khách Hàng C', N'guestC@gmail.com', N'0900000008', N'hash8', 1)
INSERT [dbo].[Users] ([id], [role_id], [membership_id], [full_name], [email], [phone], [password_hash], [status]) VALUES (9, 10, 4, N'Khách Hàng D', N'guestD@gmail.com', N'0900000009', N'hash9', 1)
INSERT [dbo].[Users] ([id], [role_id], [membership_id], [full_name], [email], [phone], [password_hash], [status]) VALUES (10, 10, 5, N'Khách Hàng E', N'guestE@gmail.com', N'0900000010', N'hash10', 1)
SET IDENTITY_INSERT [dbo].[Users] OFF
GO
SET IDENTITY_INSERT [dbo].[Vouchers] ON 

INSERT [dbo].[Vouchers] ([id], [code], [discount_type], [discount_value], [min_booking_value], [valid_from], [valid_to], [usage_limit]) VALUES (1, N'KM1', N'PERCENT', CAST(10.00 AS Decimal(18, 2)), CAST(500000.00 AS Decimal(18, 2)), CAST(N'2025-01-01T00:00:00.000' AS DateTime), CAST(N'2026-12-31T00:00:00.000' AS DateTime), 100)
INSERT [dbo].[Vouchers] ([id], [code], [discount_type], [discount_value], [min_booking_value], [valid_from], [valid_to], [usage_limit]) VALUES (2, N'KM2', N'FIXED_AMOUNT', CAST(100000.00 AS Decimal(18, 2)), CAST(1000000.00 AS Decimal(18, 2)), CAST(N'2025-01-01T00:00:00.000' AS DateTime), CAST(N'2026-12-31T00:00:00.000' AS DateTime), 50)
INSERT [dbo].[Vouchers] ([id], [code], [discount_type], [discount_value], [min_booking_value], [valid_from], [valid_to], [usage_limit]) VALUES (3, N'KM3', N'PERCENT', CAST(15.00 AS Decimal(18, 2)), CAST(2000000.00 AS Decimal(18, 2)), CAST(N'2025-01-01T00:00:00.000' AS DateTime), CAST(N'2026-12-31T00:00:00.000' AS DateTime), 30)
INSERT [dbo].[Vouchers] ([id], [code], [discount_type], [discount_value], [min_booking_value], [valid_from], [valid_to], [usage_limit]) VALUES (4, N'KM4', N'FIXED_AMOUNT', CAST(200000.00 AS Decimal(18, 2)), CAST(1500000.00 AS Decimal(18, 2)), CAST(N'2025-01-01T00:00:00.000' AS DateTime), CAST(N'2026-12-31T00:00:00.000' AS DateTime), 50)
INSERT [dbo].[Vouchers] ([id], [code], [discount_type], [discount_value], [min_booking_value], [valid_from], [valid_to], [usage_limit]) VALUES (5, N'KM5', N'PERCENT', CAST(20.00 AS Decimal(18, 2)), CAST(3000000.00 AS Decimal(18, 2)), CAST(N'2025-01-01T00:00:00.000' AS DateTime), CAST(N'2026-12-31T00:00:00.000' AS DateTime), 20)
INSERT [dbo].[Vouchers] ([id], [code], [discount_type], [discount_value], [min_booking_value], [valid_from], [valid_to], [usage_limit]) VALUES (6, N'KM6', N'FIXED_AMOUNT', CAST(50000.00 AS Decimal(18, 2)), CAST(0.00 AS Decimal(18, 2)), CAST(N'2025-01-01T00:00:00.000' AS DateTime), CAST(N'2026-12-31T00:00:00.000' AS DateTime), 200)
INSERT [dbo].[Vouchers] ([id], [code], [discount_type], [discount_value], [min_booking_value], [valid_from], [valid_to], [usage_limit]) VALUES (7, N'KM7', N'PERCENT', CAST(5.00 AS Decimal(18, 2)), CAST(0.00 AS Decimal(18, 2)), CAST(N'2025-01-01T00:00:00.000' AS DateTime), CAST(N'2026-12-31T00:00:00.000' AS DateTime), 500)
INSERT [dbo].[Vouchers] ([id], [code], [discount_type], [discount_value], [min_booking_value], [valid_from], [valid_to], [usage_limit]) VALUES (8, N'KM8', N'FIXED_AMOUNT', CAST(500000.00 AS Decimal(18, 2)), CAST(5000000.00 AS Decimal(18, 2)), CAST(N'2025-01-01T00:00:00.000' AS DateTime), CAST(N'2026-12-31T00:00:00.000' AS DateTime), 10)
INSERT [dbo].[Vouchers] ([id], [code], [discount_type], [discount_value], [min_booking_value], [valid_from], [valid_to], [usage_limit]) VALUES (9, N'KM9', N'PERCENT', CAST(25.00 AS Decimal(18, 2)), CAST(10000000.00 AS Decimal(18, 2)), CAST(N'2025-01-01T00:00:00.000' AS DateTime), CAST(N'2026-12-31T00:00:00.000' AS DateTime), 5)
INSERT [dbo].[Vouchers] ([id], [code], [discount_type], [discount_value], [min_booking_value], [valid_from], [valid_to], [usage_limit]) VALUES (10, N'KM10', N'FIXED_AMOUNT', CAST(1000000.00 AS Decimal(18, 2)), CAST(20000000.00 AS Decimal(18, 2)), CAST(N'2025-01-01T00:00:00.000' AS DateTime), CAST(N'2026-12-31T00:00:00.000' AS DateTime), 2)
SET IDENTITY_INSERT [dbo].[Vouchers] OFF
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Articles__32DD1E4C621B9F62]    Script Date: 3/7/2026 11:00:17 AM ******/
ALTER TABLE [dbo].[Articles] ADD UNIQUE NONCLUSTERED 
(
	[slug] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Bookings__FF29040FE8CDD631]    Script Date: 3/7/2026 11:00:17 AM ******/
ALTER TABLE [dbo].[Bookings] ADD UNIQUE NONCLUSTERED 
(
	[booking_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Users__AB6E61641B61BEEC]    Script Date: 3/7/2026 11:00:17 AM ******/
ALTER TABLE [dbo].[Users] ADD UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Vouchers__357D4CF9D9E4CA0D]    Script Date: 3/7/2026 11:00:17 AM ******/
ALTER TABLE [dbo].[Vouchers] ADD UNIQUE NONCLUSTERED 
(
	[code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Articles] ADD  DEFAULT (getdate()) FOR [published_at]
GO
ALTER TABLE [dbo].[Audit_Logs] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[Bookings] ADD  DEFAULT ('Pending') FOR [status]
GO
ALTER TABLE [dbo].[Invoices] ADD  DEFAULT ((0)) FOR [total_room_amount]
GO
ALTER TABLE [dbo].[Invoices] ADD  DEFAULT ((0)) FOR [total_service_amount]
GO
ALTER TABLE [dbo].[Invoices] ADD  DEFAULT ((0)) FOR [discount_amount]
GO
ALTER TABLE [dbo].[Invoices] ADD  DEFAULT ((0)) FOR [tax_amount]
GO
ALTER TABLE [dbo].[Invoices] ADD  DEFAULT ((0)) FOR [final_total]
GO
ALTER TABLE [dbo].[Invoices] ADD  DEFAULT ('Unpaid') FOR [status]
GO
ALTER TABLE [dbo].[Loss_And_Damages] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[Memberships] ADD  DEFAULT ((0)) FOR [min_points]
GO
ALTER TABLE [dbo].[Memberships] ADD  DEFAULT ((0.00)) FOR [discount_percent]
GO
ALTER TABLE [dbo].[Order_Services] ADD  DEFAULT (getdate()) FOR [order_date]
GO
ALTER TABLE [dbo].[Order_Services] ADD  DEFAULT ((0)) FOR [total_amount]
GO
ALTER TABLE [dbo].[Order_Services] ADD  DEFAULT ('Pending') FOR [status]
GO
ALTER TABLE [dbo].[Payments] ADD  DEFAULT (getdate()) FOR [payment_date]
GO
ALTER TABLE [dbo].[Reviews] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[Room_Images] ADD  DEFAULT ((0)) FOR [is_primary]
GO
ALTER TABLE [dbo].[Room_Inventory] ADD  DEFAULT ((1)) FOR [quantity]
GO
ALTER TABLE [dbo].[Room_Inventory] ADD  DEFAULT ((0)) FOR [price_if_lost]
GO
ALTER TABLE [dbo].[Rooms] ADD  DEFAULT ('Available') FOR [status]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((1)) FOR [status]
GO
ALTER TABLE [dbo].[Vouchers] ADD  DEFAULT ((0)) FOR [min_booking_value]
GO
ALTER TABLE [dbo].[Articles]  WITH CHECK ADD FOREIGN KEY([author_id])
REFERENCES [dbo].[Users] ([id])
GO
ALTER TABLE [dbo].[Articles]  WITH CHECK ADD FOREIGN KEY([category_id])
REFERENCES [dbo].[Article_Categories] ([id])
GO
ALTER TABLE [dbo].[Audit_Logs]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[Users] ([id])
GO
ALTER TABLE [dbo].[Booking_Details]  WITH CHECK ADD FOREIGN KEY([booking_id])
REFERENCES [dbo].[Bookings] ([id])
GO
ALTER TABLE [dbo].[Booking_Details]  WITH CHECK ADD FOREIGN KEY([room_id])
REFERENCES [dbo].[Rooms] ([id])
GO
ALTER TABLE [dbo].[Booking_Details]  WITH CHECK ADD FOREIGN KEY([room_type_id])
REFERENCES [dbo].[Room_Types] ([id])
GO
ALTER TABLE [dbo].[Bookings]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[Users] ([id])
GO
ALTER TABLE [dbo].[Bookings]  WITH CHECK ADD FOREIGN KEY([voucher_id])
REFERENCES [dbo].[Vouchers] ([id])
GO
ALTER TABLE [dbo].[Invoices]  WITH CHECK ADD FOREIGN KEY([booking_id])
REFERENCES [dbo].[Bookings] ([id])
GO
ALTER TABLE [dbo].[Loss_And_Damages]  WITH CHECK ADD FOREIGN KEY([booking_detail_id])
REFERENCES [dbo].[Booking_Details] ([id])
GO
ALTER TABLE [dbo].[Loss_And_Damages]  WITH CHECK ADD FOREIGN KEY([room_inventory_id])
REFERENCES [dbo].[Room_Inventory] ([id])
GO
ALTER TABLE [dbo].[Order_Service_Details]  WITH CHECK ADD FOREIGN KEY([order_service_id])
REFERENCES [dbo].[Order_Services] ([id])
GO
ALTER TABLE [dbo].[Order_Service_Details]  WITH CHECK ADD FOREIGN KEY([service_id])
REFERENCES [dbo].[Services] ([id])
GO
ALTER TABLE [dbo].[Order_Services]  WITH CHECK ADD FOREIGN KEY([booking_detail_id])
REFERENCES [dbo].[Booking_Details] ([id])
GO
ALTER TABLE [dbo].[Payments]  WITH CHECK ADD FOREIGN KEY([invoice_id])
REFERENCES [dbo].[Invoices] ([id])
GO
ALTER TABLE [dbo].[Reviews]  WITH CHECK ADD FOREIGN KEY([room_type_id])
REFERENCES [dbo].[Room_Types] ([id])
GO
ALTER TABLE [dbo].[Reviews]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[Users] ([id])
GO
ALTER TABLE [dbo].[Role_Permissions]  WITH CHECK ADD FOREIGN KEY([permission_id])
REFERENCES [dbo].[Permissions] ([id])
GO
ALTER TABLE [dbo].[Role_Permissions]  WITH CHECK ADD FOREIGN KEY([role_id])
REFERENCES [dbo].[Roles] ([id])
GO
ALTER TABLE [dbo].[Room_Images]  WITH CHECK ADD FOREIGN KEY([room_type_id])
REFERENCES [dbo].[Room_Types] ([id])
GO
ALTER TABLE [dbo].[Room_Inventory]  WITH CHECK ADD FOREIGN KEY([room_id])
REFERENCES [dbo].[Rooms] ([id])
GO
ALTER TABLE [dbo].[Rooms]  WITH CHECK ADD FOREIGN KEY([room_type_id])
REFERENCES [dbo].[Room_Types] ([id])
GO
ALTER TABLE [dbo].[RoomType_Amenities]  WITH CHECK ADD FOREIGN KEY([amenity_id])
REFERENCES [dbo].[Amenities] ([id])
GO
ALTER TABLE [dbo].[RoomType_Amenities]  WITH CHECK ADD FOREIGN KEY([room_type_id])
REFERENCES [dbo].[Room_Types] ([id])
GO
ALTER TABLE [dbo].[Services]  WITH CHECK ADD FOREIGN KEY([category_id])
REFERENCES [dbo].[Service_Categories] ([id])
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD FOREIGN KEY([membership_id])
REFERENCES [dbo].[Memberships] ([id])
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD FOREIGN KEY([role_id])
REFERENCES [dbo].[Roles] ([id])
GO
ALTER TABLE [dbo].[Reviews]  WITH CHECK ADD CHECK  (([rating]>=(1) AND [rating]<=(5)))
GO

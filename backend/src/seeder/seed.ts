import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.role.createMany({
        data: [
            {
                role_name: "Admin",
                createdAt: new Date(),
            },
            {
                role_name: "Restaurant_Owner",
                createdAt: new Date(),
            },
            {
                role_name: "Driver",
                createdAt: new Date(),
            },
            {
                role_name: "AppUser",
                createdAt: new Date(),
            },
        ],
        skipDuplicates: true,
    });
    await prisma.permission.createMany({
        data: [
            {
                permission_name: "Update",
                createdAt: new Date(),
            },
            {
                permission_name: "Delete",
                createdAt: new Date(),
            },
            {
                permission_name: "Create",
                createdAt: new Date(),
            },
            {
                permission_name: "View",
                createdAt: new Date(),
            },
        ]
    });
    await prisma.role_permission.createMany({
        data: [
            {
                role_id: 1,
                permission_id: 1,
                createdAt: new Date(),
            },
            {
                role_id: 1,
                permission_id: 2,
                createdAt: new Date(),
            },
            {
                role_id: 1,
                permission_id: 3,
                createdAt: new Date(),
            },
            {
                role_id: 1,
                permission_id: 4,
                createdAt: new Date(),
            },
            {
                role_id: 2,
                permission_id: 1,
                createdAt: new Date(),
            },
            {
                role_id: 2,
                permission_id: 2,
                createdAt: new Date(),
            },
            {
                role_id: 2,
                permission_id: 3,
                createdAt: new Date(),
            },
            {
                role_id: 2,
                permission_id: 4,
                createdAt: new Date(),
            },
            {
                role_id: 3,
                permission_id: 1,
                createdAt: new Date(),
            },
            {
                role_id: 3,
                permission_id: 4,
                createdAt: new Date(),
            },
            {
                role_id: 4,
                permission_id: 1,
                createdAt: new Date(),
            },
            {
                role_id: 4,
                permission_id: 2,
                createdAt: new Date(),
            },
            {
                role_id: 4,
                permission_id: 4,
                createdAt: new Date(),
            },
        ]
    })
    await prisma.user.createMany({
        data: [
            {
                fname: "Puja",
                lname: "Moravadiya",
                email: "puja@gmail.com",
                phone: "9313003213",
                gender: "female",
                bd: new Date(2002 - 11 - 30),
                password: "$2y$07$xt1NeBAo.FsO7MSU2ZMoR.S6TYVay6HSoyo2pzE/fenCBJUTEg6VS",
                role_id: 1,
                city: "talala",
                state: "gujarat",
                street: "0,sasan road, kumbhani para",
                pincode: "362150",
                createdAt: new Date(),
            },
            {
                fname: "Maya",
                lname: "Vora",
                email: "maya@gmail.com",
                phone: "8974859632",
                gender: "female",
                bd: new Date(2003 - 12 - 15),
                password: "$2y$07$DEa8tVTNDaZp8hYOUODyj.qfMnEdDwrFt4Ec8QxAqqu.nK5BGXxE.",
                role_id: 2,
                city: "jungadh",
                state: "gujarat",
                street: "Mangnath Rd,",
                pincode: "362001",
                createdAt: new Date(),
            },
            {
                fname: "Aarav",
                lname: "Patel",
                email: "aarav@gmail.com",
                phone: "8745963258",
                gender: "male",
                bd: new Date(2002 - 6 - 5),
                password: "$2y$07$fJgexL.iM4lgVyJFk9BWdeRKj6FE7dDJCh1VVYpWZN6Er.t8UWmAu",
                role_id: 2,
                city: "Himatnagar",
                state: "gujarat",
                street: "Alkapuri Pologround, Alkapuri",
                pincode: "383001",
                createdAt: new Date(),
            },
            {
                fname: "Khushi",
                lname: "mehra",
                email: "khushi@gmail.com",
                phone: "7969854896",
                gender: "female",
                bd: new Date(2002 - 5 - 13),
                password: "$2y$07$Uy8tKFL6o6M6wj86Y2IE2e0jpqk4BkUuDYAG2WSIv3z9KcajKTEaG",
                role_id: 2,
                city: "Ahmedabad",
                state: "gujarat",
                street: "Sunrise Park Rd, Gurukul",
                pincode: "380052",
                createdAt: new Date(),
            },
            {
                fname: "Koushtubh",
                lname: "Acharya",
                email: "koushtubh@gmail.com",
                phone: "7930115555",
                gender: "male",
                bd: new Date(2003 - 5 - 12),
                password: "Dev@123",
                role_id: 2,
                city: "Ahmedabad",
                state: "gujarat",
                street: "Lal Darwaja",
                pincode: "380001",
                createdAt: new Date(),
            },
            {
                fname: "Manish",
                lname: "Dey",
                email: "manish@gmail.com",
                phone: "7922774647",
                gender: "male",
                bd: new Date(2003 - 5 - 12),
                password: "Devv@123",
                role_id: 2,
                city: "Vadodara",
                state: "gujarat",
                street: "Swaminarayan Mandir Rd, Badri Mohalla, Moghul Wada",
                pincode: "390017",
                createdAt: new Date(),
            },
            {
                fname: "Saurabh",
                lname: "Kalla",
                email: "saurabh@gmail.com",
                phone: "9313003213",
                gender: "male",
                bd: new Date(2003 - 5 - 12),
                password: "Dev@1234",
                role_id: 3,
                city: "Ahmedabad",
                state: "gujarat",
                street: "1/2 Gitanjali Complex, Navrangpura",
                pincode: "380013",
                createdAt: new Date(),
            },
            {
                fname: "Srinivasan",
                lname: "Choudhry",
                email: "srinivasan@gmail.com",
                phone: "7922862591",
                gender: "male",
                bd: new Date(2003 - 5 - 12),
                password: "Dev@12345",
                role_id: 4,
                city: "Surat",
                state: "gujarat",
                street: "Adajan Gam",
                pincode: "395009",
                createdAt: new Date(),
            },
            {
                fname: "Yogesh",
                lname: "Verma",
                email: "yogesh@gmail.com",
                phone: "9925243337",
                gender: "male",
                bd: new Date(2003 - 5 - 12),
                password: "Dev@1236",
                role_id: 3,
                city: "Ahmedabad",
                state: "gujarat",
                street: "Airport Cir",
                pincode: "382475",
                createdAt: new Date(),
            },
        ]
    });
    await prisma.restaurant.createMany({
        data: [
            {
                name: "SpiceCraft",
                user_id: 2,
                address: "1/2 Gitanjali Complex, Navrangpura,Ahmedabad,Gujarat,380013",
                phone: "8974859623",
                image: "uploads/image-1721393617657-643010505-res1.jpeg",
                createdAt: new Date(),
            },
            {
                name: "Ascent: Alpine-Style Cuisine",
                user_id: 3,
                address: "Bombay Conductor Rd, Phase I, GIDC Vatwa,Ahmedabad,Gujarat,382445",
                phone: "7896584120",
                image: "uploads/image-1721393638532-667782212-res2.jpg",
                createdAt: new Date(),
            },
            {
                name: "Red Stiletto Restaurant",
                user_id: 4,
                address: "Swami Vivekananda Rd, Raikhad,Ahmedabad,Gujarat,380001",
                phone: "9965874521",
                image: "uploads/image-1721393653272-190403610-res3.jpg",
                createdAt: new Date(),
            },
            {
                name: "The Winstonian",
                user_id: 5,
                address: "GIDC Kabilpore,Navsari,Gujarat,396427",
                phone: "8974521596",
                image: "uploads/image-1721393668525-953404359-res4.jpg",
                createdAt: new Date(),
            },
            {
                name: "The Nouveau Table",
                user_id: 6,
                address: "Ganesh Circle, Mangalpura,Anand,Gujarat,388001",
                phone: "7979854628",
                image: "uploads/image-1721393692147-422516782-res55.jpeg",
                createdAt: new Date(),
            },
        ]
    });
    await prisma.menu.createMany({
        data: [
            {
                restaurant_id: 1,
                item_name: "italian pizza",
                price: 150,
                image: "uploads/image-1721394051818-850304740-italian.jpg",
                createdAt: new Date(),
            },
            {
                restaurant_id: 1,
                item_name: "sandwich",
                price: 120,
                image: "uploads/image-1721394082834-695463509-sandwitch.jpg",
                createdAt: new Date(),
            },
            {
                restaurant_id: 1,
                item_name: "french fries",
                price: 70,
                image: "uploads/image-1721394094453-367136742-french_fries.jpeg",
                createdAt: new Date(),
            },
            {
                restaurant_id: 2,
                item_name: "manchurian",
                price: 100,
                image: "uploads/image-1721394281317-314881175-manchurian.jpeg",
                createdAt: new Date(),
            },
            {
                restaurant_id: 2,
                item_name: "chowmein",
                price: 80,
                image: "uploads/image-1721394292716-313256665-chowmein.jpg",
                createdAt: new Date(),
            },
            {
                restaurant_id: 2,
                item_name: "fried rice",
                price: 120,
                image: "uploads/image-1721394303518-272835406-fried_rice.jpg",
                createdAt: new Date(),
            },
            {
                restaurant_id: 3,
                item_name: "chilli paneer",
                price: 120,
                image: "uploads/image-1721394324538-380055601-chilli_panner.jpeg",
                createdAt: new Date(),
            },
            {
                restaurant_id: 3,
                item_name: "garlic bread",
                price: 256,
                image: "uploads/image-1721394334601-783004394-garlic_bread.jpg",
                createdAt: new Date(),
            },
            {
                restaurant_id: 3,
                item_name: "fixed punjabi thali",
                price: 250,
                image: "uploads/image-1721394349179-862086351-fixed_punjabi_thali.jpeg",
                createdAt: new Date(),
            },
            {
                restaurant_id: 4,
                item_name: "veg hot & sour soup",
                price: 80,
                image: "uploads/image-1721394362679-425507601-hot-and-sour-soup.jpg",
                createdAt: new Date(),
            },
            {
                restaurant_id: 4,
                item_name: "paneer roll",
                price: 130,
                image: "uploads/image-1721394378993-162379098-panner_roll.jpg",
                createdAt: new Date(),
            },
            {
                restaurant_id: 4,
                item_name: "vge momos",
                price: 70,
                image: "uploads/image-1721394418678-643576727-veg_momos.jpg",
                createdAt: new Date(),
            },
            {
                restaurant_id: 5,
                item_name: "burger",
                price: 100,
                image: "uploads/image-1721394432922-307305546-burger.jpg",
                createdAt: new Date(),
            },
            {
                restaurant_id: 5,
                item_name: "vadapaw",
                price: 50,
                image: "uploads/image-1721394462666-92334847-vadapaw.jpeg",
                createdAt: new Date(),
            },
        ]
    });
    await prisma.driver.createMany({
        data: [
            {
                user_id: 7,
                createdAt: new Date(),
            },
            {
                user_id: 9,
                createdAt: new Date(),
            },
            {
                user_id: 9,
                createdAt: new Date(),
            },
        ]
    });
    await prisma.order.createMany({
        data: [
            {
                user_id: 8,
                restaurant_id: 2,
                total_amount: 450,
                createdAt: new Date(),
            },
            {
                user_id: 8,
                restaurant_id: 1,
                total_amount: 250,
                createdAt: new Date(),
            },
            {
                user_id: 8,
                restaurant_id: 2,
                total_amount: 625,
                createdAt: new Date(),
            },
        ]
    });
    await prisma.delivery.createMany({
        data: [
            {
                order_id: 1,
                driver_id: 1,
                delivery_status: "pending",
                delivery_date: new Date(),
                createdAt: new Date(),
            },
            {
                order_id: 2,
                driver_id: 2,
                delivery_status: "pending",
                delivery_date: new Date(),
                createdAt: new Date(),
            },
            {
                order_id: 3,
                driver_id: 1,
                delivery_status: "pending",
                delivery_date: new Date(),
                createdAt: new Date(),
            }
        ]
    });
    await prisma.payment.createMany({
        data: [
            {
                order_id: 1,
                payment_method: "upi",
                total_amount: 450,
                status: "success",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                order_id: 2,
                payment_method: "upi",
                total_amount: 250,
                status: "success",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                order_id: 3,
                payment_method: "upi",
                total_amount: 625,
                status: "success",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]
    });
    await prisma.rating.createMany({
        data: [
            {
                user_id: 1,
                menu_id: 1,
                rating: 4.2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                user_id: 1,
                menu_id: 2,
                rating: 3.8,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                user_id: 1,
                menu_id: 3,
                rating: 3.2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                user_id: 1,
                menu_id: 4,
                rating: 4.8,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                user_id: 2,
                menu_id: 1,
                rating: 2.8,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                user_id: 2,
                menu_id: 2,
                rating: 3.6,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                user_id: 2,
                menu_id: 3,
                rating: 4.5,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                user_id: 2,
                menu_id: 4,
                rating: 1.6,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                user_id: 3,
                menu_id: 1,
                rating: 5,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                user_id: 3,
                menu_id: 2,
                rating: 3.3,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                user_id: 3,
                menu_id: 3,
                rating: 2.4,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                user_id: 3,
                menu_id: 4,
                rating: 2.9,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                user_id: 4,
                menu_id: 1,
                rating: 3.7,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                user_id: 4,
                menu_id: 2,
                rating: 4.8,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                user_id: 4,
                menu_id: 3,
                rating: 2.5,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                user_id: 4,
                menu_id: 4,
                rating: 3.8,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]
    })
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
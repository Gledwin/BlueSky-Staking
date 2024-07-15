import Image from "next/image"
import Link from "next/link"

const footer =() => {
    return (
    <div className = 'py-20 px-4 md:px-8 lg:px-16 xl:32 2xl:px-64 bg-gray-100 text-sm text-black mt-24'>
    {/*left*/}
    <div className="w-full md:w-1/2 lg:w-1/4 flex flex-col gap-8">
    <Link href = "/">
    <div className="text-2xl tracking-wide">BLUESKY</div>
    </Link>
    <p>
        58 Peters St, District, Cape Town, 8214, Western Cape
    </p>
    <span className="font-semibold">info@bookstore.com</span>
    <span className="font-semibold">+27 21 465 7786</span>
    <div className="flex gap-6">
        <Image src="/facebook.png" alt="" width={16} height={16} />
        <Image src="/instagram.png" alt="" width={16} height={16} />
        <Image src="/youtube.png" alt="" width={16} height={16} />
        <Image src="/pinterest.png" alt="" width={16} height={16} />
        <Image src="/x.png" alt="" width={16} height={16} />


    </div>


    </div>
    
    
    
    {/*BOTTOM*/}

        <div className ="flex flex-col md:flex-row items-center justify-between gap-8 mt-16">
            <div className ="">2024 BlueSky Bookstore</div>
            <div className="flex flex-col gap-8 md:flex-row">
                <div className="">
                    <span className ="text-gray-500 mr-4">Language</span>
                    <span className ="font-medium">South Africa | English</span>
                </div>
                <div className="">
                    <span className ="text-gray-500 mr-4">Currency</span>
                    <span className ="font-medium">cUSD</span>
                </div>
            </div>


        </div>
    </div>
    )
}

export default footer
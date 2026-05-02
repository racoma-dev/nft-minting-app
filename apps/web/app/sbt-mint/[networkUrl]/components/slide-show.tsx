'use client';

import Image from 'next/image';
import Slider from 'react-slick';

const images = [
  { id: '1', src: '/car-nft/car-nft-5.jpg' },
  { id: '2', src: '/car-nft/car-nft-4.jpg' },
  { id: '3', src: '/car-nft/car-nft-3.jpg' },
  { id: '4', src: '/car-nft/car-nft-2.jpg' },
  { id: '5', src: '/car-nft/car-nft-1.jpg' },
];

const settings = {
  arrows: false,
  dots: false,
  fade: true,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
};

export default function Slideshow() {
  return (
    <div className="w-full h-auto">
      <Slider {...settings}>
        {images.map((image) => (
          <div key={image.id}>
            <Image
              src={image.src}
              alt={`NFT Image ${image.id}`}
              width={400}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

'use client';

import Image from 'next/image';
import Slider from 'react-slick';

const images = [
  { id: '1', src: '/pet-nft/pet-nft-5.jpeg' },
  { id: '2', src: '/pet-nft/pet-nft-4.jpeg' },
  { id: '3', src: '/pet-nft/pet-nft-3.jpeg' },
  { id: '4', src: '/pet-nft/pet-nft-2.jpeg' },
  { id: '5', src: '/pet-nft/pet-nft-1.jpeg' },
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

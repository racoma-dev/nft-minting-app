'use client';

import Image from 'next/image';
import Slider from 'react-slick';

const images = [
  { id: '1', src: '/alien-nft/alien-nft-5.jpg' },
  { id: '2', src: '/alien-nft/alien-nft-4.jpg' },
  { id: '3', src: '/alien-nft/alien-nft-3.jpg' },
  { id: '4', src: '/alien-nft/alien-nft-2.jpg' },
  { id: '5', src: '/alien-nft/alien-nft-1.jpg' },
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

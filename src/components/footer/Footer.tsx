import Link from 'next/link'
import FadeIn from '../fadeIn/FadeIn'
import Logo from '../logo/Logo'
import Socials from '../socials/Socials'
import FooterUp from './FooterUp'

interface FooterProps {
  logoData?: { altText: string; sourceUrl: string } | null
  vk?: import('@/graphql/types/siteSettingsTypes').SiteSettingsVk[]
  telegram?: string
  instagram?: string
  telefon?: string
  email?: string
  menuItems?: import('@/graphql/types/menuTypes').MenuItemNode[]
}

const Footer = ({
  logoData,
  vk,
  instagram,
  telegram,
  telefon,
  email,
  menuItems,
}: FooterProps) => {
  return (
    <footer className="footer cont ind">
      <FadeIn className="w-full bg-white rounded-box p-10">
        {/* Верхний блок: мобильный flex, десктоп grid */}
        <div className="w-full flex flex-col gap-4 md:grid md:grid-cols-4 md:gap-0 md:justify-between md:items-start">
          {/* Логотип */}
          <div className="flex flex-row gap-4 items-center md:items-start md:block md:col-span-1 md:gap-0">
            <Logo
              className="md:my-4 flex flex-col justify-center z-20 md:h-[84px] md:w-[84px]"
              type="file"
              logo={logoData?.sourceUrl}
              logoAlt={logoData?.altText}
              width={44.34}
              height={43.812}
            />
            {/* Навигация только для mobile рядом с логотипом */}
            <div className="flex flex-col justify-center ml-4 md:hidden">
              <h5 className="font-medium">Навигация</h5>
              {menuItems && menuItems.length > 0 && (
                <ul className="md:mt-4 flex flex-row md:flex-col gap-2">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        className="font-normal text-base hover:text-primary"
                        href={item.uri}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {/* Навигация для десктопа отдельной колонкой */}
          <div className="hidden md:block md:col-span-1">
            <h5 className="font-medium">Навигация</h5>
            {menuItems && menuItems.length > 0 && (
              <ul className="mt-6 flex flex-col gap-2">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      className="font-normal text-base hover:text-primary"
                      href={item.uri}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Контакты */}
          <div className="flex flex-col mt-6 md:mt-0 md:col-span-1">
            <h5 className="hidden md:block font-medium">Контакты</h5>
            <div className="mt-0 md:mt-6 flex flex-col gap-4">
              {telefon && (
                <a
                  href={`tel:${telefon}`}
                  className="flex items-center gap-2 font-medium hover:underline"
                >
                  <span className="inline-block">
                    {/* phone.svg */}
                    <svg
                      width="21"
                      height="20"
                      viewBox="0 0 21 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M2.69432 1.66379C3.95385 0.411507 6.02789 0.634021 7.0825 2.04362L8.38861 3.78647C9.24761 4.9332 9.17103 6.5353 8.1516 7.54851L7.90528 7.79483C7.87735 7.89823 7.87452 8.00681 7.89701 8.11153C7.96221 8.53378 8.31512 9.42798 9.79303 10.8976C11.2709 12.3672 12.1713 12.7191 12.5998 12.7854C12.7078 12.8071 12.8193 12.8039 12.9258 12.776L13.3481 12.3559C14.2547 11.4554 15.6457 11.2867 16.7676 11.8963L18.7443 12.9727C20.4385 13.8917 20.8659 16.1934 19.4791 17.573L18.0085 19.0344C17.5448 19.4949 16.9218 19.8789 16.1621 19.9503C14.2888 20.1252 9.92447 19.9017 5.33654 15.3406C1.05496 11.0829 0.233209 7.36947 0.128679 5.53968C0.076932 4.61443 0.513681 3.83201 1.07048 3.27935L2.69432 1.66379ZM5.84056 2.97404C5.31584 2.27338 4.33885 2.21749 3.78826 2.76498L2.16339 4.3795C1.82186 4.71896 1.65833 5.09362 1.67903 5.45171C1.76183 6.90581 2.4242 10.2559 6.43152 14.2405C10.6355 18.4196 14.5176 18.5448 16.0182 18.4041C16.3246 18.3762 16.6289 18.2168 16.9135 17.9342L18.3831 16.4718C18.9813 15.8778 18.8499 14.7952 18.0033 14.3357L16.0265 13.2604C15.4801 12.9644 14.8405 13.0617 14.4431 13.457L13.9722 13.9259L13.4236 13.3753C13.9722 13.9259 13.9711 13.9269 13.9701 13.9269L13.9691 13.929L13.9659 13.9321L13.9587 13.9383L13.9432 13.9528C13.8995 13.9933 13.8524 14.03 13.8024 14.0625C13.7196 14.1173 13.6099 14.1784 13.4723 14.2291C13.1928 14.3336 12.8223 14.3895 12.3649 14.3191C11.4676 14.1815 10.2784 13.5698 8.69806 11.9988C7.11872 10.4277 6.50189 9.24583 6.36321 8.34956C6.2918 7.89212 6.34872 7.52161 6.45429 7.24217C6.51239 7.08493 6.59557 6.93813 6.7006 6.80749L6.73372 6.77127L6.74821 6.75574L6.75442 6.74953L6.75753 6.74643L6.7596 6.74436L7.05766 6.44836C7.50062 6.00644 7.56272 5.27473 7.14563 4.71689L5.84056 2.97404Z"
                        fill="#FE520A"
                      />
                    </svg>
                  </span>
                  <span className="font-normal">{telefon}</span>
                </a>
              )}
              {telegram && (
                <a
                  href={
                    telegram.startsWith('http')
                      ? telegram
                      : `https://t.me/${telegram.replace('@', '')}`
                  }
                  className="flex items-center gap-2 font-medium hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="inline-block">
                    {/* tg.svg */}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 12 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.66034 10.7337C9.56661 10.7337 9.47351 10.7059 9.39365 10.6518L6.37637 8.60511L4.75807 9.76956C4.63115 9.86082 4.46756 9.88381 4.32018 9.83112C4.173 9.7783 4.06121 9.65638 4.02131 9.5052L3.20874 6.4258L0.305342 5.31563C0.122562 5.24571 0.00134106 5.07084 1.10522e-05 4.87514C-0.00131895 4.67944 0.117495 4.50293 0.299389 4.43054L11.3392 0.0377233C11.3893 0.0164432 11.4423 0.00415642 11.4957 0.000863072C11.5149 -0.000276932 11.5341 -0.000276898 11.5531 0.000799773C11.6638 0.00738646 11.7726 0.05248 11.8574 0.1357C11.8663 0.144314 11.8746 0.153117 11.8825 0.1623C11.9528 0.242607 11.9915 0.340521 11.9987 0.440271C12.0005 0.465351 12.0004 0.490748 11.9982 0.516145C11.9967 0.534258 11.9941 0.552308 11.9904 0.570232L10.1269 10.3476C10.097 10.5047 9.99006 10.6362 9.84236 10.6974C9.78378 10.7217 9.7219 10.7337 9.66034 10.7337ZM6.64129 7.63686L9.32898 9.45992L10.7789 1.85204L5.54208 6.89124L6.62863 7.62831C6.633 7.63104 6.63718 7.63395 6.64129 7.63686ZM4.40391 7.23146L4.76377 8.59504L5.5391 8.03713L4.52386 7.34844C4.47668 7.31652 4.43627 7.27675 4.40391 7.23146ZM1.78196 4.86304L3.77558 5.62526C3.9184 5.67986 4.02619 5.79994 4.0652 5.94776L4.31803 6.90593C4.32962 6.79541 4.37972 6.69142 4.4611 6.61308L9.45109 1.81151L1.78196 4.86304Z"
                        fill="#FE520A"
                      />
                    </svg>
                  </span>
                  <span className="font-normal">{telegram}</span>
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 font-medium hover:underline"
                >
                  <span className="inline-block">
                    {/* mail.svg */}
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.6667 6.68356V3.33334C12.6667 2.598 12.0687 2 11.3333 2H1.33331C0.597969 2 0 2.59797 0 3.33334V10C0 10.7353 0.597969 11.3333 1.33334 11.3333H8.80881C9.24556 12.87 10.6585 14 12.3333 14C12.9779 14 13.6117 13.8304 14.167 13.5091C14.3262 13.417 14.3809 13.2132 14.2884 13.0537C14.1963 12.8942 13.9922 12.8392 13.833 12.9323C13.3792 13.1947 12.8607 13.3333 12.3333 13.3333C10.679 13.3333 9.33331 11.9876 9.33331 10.3333C9.33331 8.67906 10.679 7.33334 12.3333 7.33334C13.9876 7.33334 15.3333 8.67906 15.3333 10.3333V10.6667C15.3333 11.0342 15.0342 11.3333 14.6667 11.3333C14.2992 11.3333 14 11.0342 14 10.6667V9.33334C14 9.14909 13.8509 9 13.6667 9C13.577 9 13.4964 9.03628 13.4366 9.09375C13.142 8.83122 12.758 8.66666 12.3333 8.66666C11.4144 8.66666 10.6667 9.41437 10.6667 10.3333C10.6667 11.2522 11.4144 12 12.3333 12C12.8301 12 13.2718 11.7772 13.5774 11.4312C13.8189 11.7742 14.2162 12 14.6667 12C15.402 12 16 11.402 16 10.6667V10.3333C16 8.42403 14.5326 6.85275 12.6667 6.68356ZM1.33334 2.66666H11.3333C11.3472 2.66666 11.3588 2.67375 11.3725 2.67459L6.60744 6.58594C6.43784 6.69272 6.19206 6.67056 6.08172 6.60288L1.29456 2.67453C1.30809 2.67372 1.31959 2.66666 1.33334 2.66666ZM12 6.68356C10.134 6.85275 8.66666 8.42403 8.66666 10.3333C8.66666 10.4458 8.67356 10.5567 8.68353 10.6667H1.33334C0.965844 10.6667 0.666687 10.3675 0.666687 10V3.33334C0.666687 3.23894 0.687531 3.14978 0.723094 3.06834L5.68819 7.14C5.88219 7.26662 6.10519 7.33337 6.33337 7.33337C6.55278 7.33337 6.76728 7.27153 6.95609 7.15434C6.97497 7.14425 6.99287 7.13222 7.00981 7.11822L11.9436 3.06828C11.9792 3.14978 12 3.23894 12 3.33337V6.68356H12ZM12.3333 11.3333C11.7819 11.3333 11.3333 10.8848 11.3333 10.3333C11.3333 9.78191 11.7819 9.33334 12.3333 9.33334C12.8848 9.33334 13.3333 9.78191 13.3333 10.3333C13.3333 10.8848 12.8848 11.3333 12.3333 11.3333Z"
                        fill="#FE520A"
                      />
                    </svg>
                  </span>
                  <span className="font-normal">{email}</span>
                </a>
              )}
            </div>
          </div>
          {/* Соцсети */}
          <div className="flex flex-row justify-between items-center md:items-start md:flex-col mt-6 md:mt-0">
            <h5 className="font-medium">Мы в социальных сетях</h5>
            <div className="md:mt-6 flex flex-row flex-wrap">
              <Socials vk={vk} instagram={instagram} />
            </div>
          </div>
        </div>
        {/* Нижний блок: политика и кнопка наверх */}
        <div className="flex flex-row w-full justify-between mt-8">
          <Link
            href="/privacy-policy"
            className="border-black border-t-[1px] pt-4"
          >
            Политика конфиденциальности
          </Link>
          <FooterUp />
        </div>
      </FadeIn>
    </footer>
  )
}

export default Footer

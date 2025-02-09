import { Helmet } from 'react-helmet-async';
import logo from '../assets/logotransparent.png';

interface SEOProps {
  title: string;
  description?: string;
  name?: string;
  type?: string;
  image?: string;
  url?: string;
  keywords?: string;
}

const SEO = ({ 
  title, 
  description = 'Uw partner voor een spirituele en onvergetelijke reis naar Mekka en Medina. Boek nu uw exclusieve Umrah-pakket en ervaar comfort en kwaliteit.', 
  name = 'Guide2Umrah',
  type = 'website',
  image = logo,
  url = 'https://www.guide2umrah.com',
  keywords
}: SEOProps) => {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name='description' content={description} />
      {keywords && <meta name='keywords' content={keywords} />}

      {/* OpenGraph tags */}
      <meta property='og:url' content={url} />
      <meta property='og:type' content={type} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={image} />

      {/* Twitter Card tags */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={image} />

      {/* Canonical URL */}
      <link rel='canonical' href={url} />
    </Helmet>
  );
};

export default SEO;

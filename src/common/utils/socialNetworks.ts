import { SocialBranch } from '@/api/types/branches/branches.types';

export type SocialNetworkType = 'facebook' | 'instagram' | 'twitter' | 'whatsapp' | 'tiktok' | 'youtube' | 'other';

export interface NormalizedSocialNetwork {
  type: SocialNetworkType;
  displayName: string;
  url: string;
  originalData: SocialBranch;
}

export function normalizeSocialNetwork(social: SocialBranch): NormalizedSocialNetwork {
  if (!social) {
    return {
      type: 'other',
      displayName: 'Red Social',
      url: '#',
      originalData: social
    };
  }

  const networkId = (social.social_network_id || social.social_network_name || '').toString().toLowerCase();
  const description = social.description || '';
  
  let type: SocialNetworkType = 'other';
  let displayName = description || 'Red Social';
  let url = social.value || social.url || '#';
  
  if (networkId.includes('facebook') || description.toLowerCase().includes('facebook')) {
    type = 'facebook';
    displayName = social.description || 'Facebook';
    if (!url.includes('://')) {
      url = `https://facebook.com/${extractUsername(url)}`;
    }
  } 
  else if (networkId.includes('instagram') || description.toLowerCase().includes('instagram')) {
    type = 'instagram';
    displayName = social.description || 'Instagram';
    if (!url.includes('://')) {
      url = `https://instagram.com/${extractUsername(url)}`;
    }
  }
  else if (networkId.includes('twitter') || description.toLowerCase().includes('twitter')) {
    type = 'twitter';
    displayName = social.description || 'Twitter';
    if (!url.includes('://')) {
      url = `https://twitter.com/${extractUsername(url)}`;
    }
  }
  else if (networkId.includes('whatsapp') || description.toLowerCase().includes('whatsapp')) {
    type = 'whatsapp';
    displayName = social.description || 'WhatsApp';
    if (!url.includes('://') && url.match(/^\d+$/)) {
      url = `https://wa.me/${url}`;
    }
  }
  else if (networkId.includes('tiktok') || description.toLowerCase().includes('tiktok')) {
    type = 'tiktok';
    displayName = social.description || 'TikTok';
    if (!url.includes('://')) {
      url = `https://tiktok.com/@${extractUsername(url)}`;
    }
  }
  else if (networkId.includes('youtube') || description.toLowerCase().includes('youtube')) {
    type = 'youtube';
    displayName = social.description || 'YouTube';
    if (!url.includes('://')) {
      url = `https://youtube.com/${extractUsername(url)}`;
    }
  }
  
  return {
    type,
    displayName,
    url,
    originalData: social
  };
}

// Extraer nombre de usuario de una URL o texto
function extractUsername(value: string): string {
  if (!value) return '';
  
  // Si es una URL, intentar extraer el nombre de usuario
  if (value.includes('://')) {
    try {
      const url = new URL(value);
      const pathParts = url.pathname.split('/').filter(Boolean);
      return pathParts[0] || '';
    } catch (e) {
      return value;
    }
  }
  
  // Si no es URL, asumir que es el nombre de usuario
  return value.replace('@', '');
}
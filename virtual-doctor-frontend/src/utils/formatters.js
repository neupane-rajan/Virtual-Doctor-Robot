export const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };
  
  export const formatDateTime = (dateString, timeString) => {
    if (!dateString) return '';
    if (timeString) {
      return new Date(`${dateString}T${timeString}`).toLocaleString();
    }
    return new Date(dateString).toLocaleString();
  };
  
  export const formatFrequency = (frequency) => {
    if (!frequency) return '';
    
    const frequencyMap = {
      'once_daily': 'Once Daily',
      'twice_daily': 'Twice Daily',
      'three_times_daily': 'Three Times Daily',
      'four_times_daily': 'Four Times Daily',
      'as_needed': 'As Needed'
    };
    
    return frequencyMap[frequency] || frequency.replace('_', ' ');
  };
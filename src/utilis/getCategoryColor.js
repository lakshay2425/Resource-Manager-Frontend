export const getCategoryColor = (category) => {
    const colorPalettes = [
      'bg-blue-100 text-blue-700 border-blue-200',
      'bg-purple-100 text-purple-700 border-purple-200',
      'bg-green-100 text-green-700 border-green-200',
      'bg-orange-100 text-orange-700 border-orange-200',
      'bg-pink-100 text-pink-700 border-pink-200',
      'bg-indigo-100 text-indigo-700 border-indigo-200',
      'bg-red-100 text-red-700 border-red-200',
      'bg-teal-100 text-teal-700 border-teal-200',
      'bg-yellow-100 text-yellow-700 border-yellow-200',
      'bg-cyan-100 text-cyan-700 border-cyan-200',
      'bg-emerald-100 text-emerald-700 border-emerald-200',
      'bg-violet-100 text-violet-700 border-violet-200'
    ];
    
    let hash = 0;
    for (let i = 0; i < category.length; i++) {
      const char = category.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    const colorIndex = Math.abs(hash) % colorPalettes.length;
    return colorPalettes[colorIndex];
  };

  
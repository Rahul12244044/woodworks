export const sampleProjects = [
  {
    _id: '1',
    title: 'Live Edge Walnut Dining Table',
    description: 'A stunning live edge walnut dining table that brings natural beauty to any dining room. The rich chocolate brown tones and flowing grain patterns create a centerpiece that will be cherished for generations.',
    fullDescription: `This beautiful live edge walnut dining table was crafted from a single black walnut slab. The natural edges were preserved to showcase the tree's unique character, while the top was finished with a food-safe epoxy resin for durability and a glass-like surface.

The base features custom-made steel hairpin legs that provide industrial contrast to the organic wood top. The project required careful planning to balance the slab's natural shape while creating a functional dining surface.

Materials used:
- Black Walnut Live Edge Slab (2.5" thick)
- Food-safe epoxy resin
- Custom steel hairpin legs
- Natural oil finish`,
    category: 'furniture',
    difficulty: 'intermediate',
    estimatedTime: '40 hours',
    materials: [
      { productId: '1', name: 'Black Walnut Live Edge Slab', quantity: 1 },
      { productId: '4', name: 'Teak Decking Board', quantity: 2 }
    ],
    tools: ['Table saw', 'Planer', 'Router', 'Orbital sander', 'Clamps'],
    images: [
      { url: 'https://pathwaytables.com/wp-content/uploads/2022/03/IMG_4099-scaled.jpg', alt: 'Completed walnut dining table' },
      { url: 'https://elkohardwoods.com/wp-content/uploads/2021/06/custom-live-edge-walnut-dining-table.jpg', alt: 'Close-up of walnut grain' },
      { url: 'https://gulnatural.com/cdn/shop/files/Custom-Live-Edge-Walnut-Dining-Table-Gul-Natural-504.webp?v=1706451626&width=1946', alt: 'Table in dining room setting' }
    ],
    featured: true,
    createdAt: '2024-01-15',
    author: 'Sarah Johnson'
  },
  {
    _id: '2',
    title: 'Curly Maple Cutting Board Set',
    description: 'A beautiful set of end-grain cutting boards made from highly figured curly maple. The stunning tiger stripe patterns make these both functional and decorative.',
    fullDescription: `These end-grain cutting boards were made from curly maple offcuts, showcasing how even smaller pieces of figured wood can create stunning projects. The end-grain construction is gentle on knife edges and provides a self-healing surface.

Each board was carefully laminated to create checkerboard patterns, then finished with multiple coats of food-grade mineral oil and beeswax. The set includes three sizes perfect for different kitchen tasks.

The curly maple's dramatic figure changes appearance depending on the viewing angle, creating a dynamic piece that catches light beautifully.`,
    category: 'kitchen',
    difficulty: 'beginner',
    estimatedTime: '8 hours',
    materials: [
      { productId: '3', name: 'Curly Maple Turning Blank', quantity: 3 },
      { productId: '6', name: 'Birdseye Maple Board', quantity: 1 }
    ],
    tools: ['Table saw', 'Planer', 'Clamps', 'Orbital sander'],
    images: [
      { url: 'https://i.etsystatic.com/27867910/r/il/0a8833/2982152530/il_fullxfull.2982152530_mj1n.jpg', alt: 'Maple cutting board set' },
      { url: 'http://lonestarartisans.com/wp-content/uploads/2011/10/MG_0290.jpg', alt: 'Close-up of curly maple pattern' }
    ],
    featured: true,
    createdAt: '2024-02-03',
    author: 'Mike Chen'
  },
  {
    _id: '3',
    title: 'White Oak Bookshelf',
    description: 'A minimalist white oak bookshelf with quarter-sawn grain patterns. Perfect for displaying books and decor while adding warmth to any room.',
    fullDescription: `This bookshelf showcases the beautiful ray fleck patterns unique to quarter-sawn white oak. The design emphasizes clean lines and the natural beauty of the wood, with hidden joinery for a seamless appearance.

The project used traditional mortise and tenon joints reinforced with modern woodworking techniques. The finish is a natural hardwax oil that protects the wood while allowing its character to shine through.

Each shelf is adjustable, making the unit versatile for different types of books and display items. The quarter-sawn construction ensures exceptional stability and resistance to warping.`,
    category: 'furniture',
    difficulty: 'advanced',
    estimatedTime: '25 hours',
    materials: [
      { productId: '2', name: 'White Oak Lumber - 4/4', quantity: 8 },
      { productId: '5', name: 'Cherry Wood Planks', quantity: 2 }
    ],
    tools: ['Table saw', 'Router', 'Chisels', 'Clamps', 'Planer'],
    images: [
      { url: '/images/projects/oak-bookshelf-1.jpg', alt: 'White oak bookshelf' },
      { url: '/images/projects/oak-bookshelf-2.jpg', alt: 'Bookshelf detail' },
      { url: '/images/projects/oak-bookshelf-3.jpg', alt: 'Grain close-up' }
    ],
    featured: false,
    createdAt: '2024-01-28',
    author: 'David Martinez'
  },
  {
    _id: '4',
    title: 'Teak Outdoor Bench',
    description: 'A durable teak bench perfect for outdoor spaces. The natural oils in teak provide excellent weather resistance without any chemical treatment.',
    fullDescription: `This outdoor bench was designed to withstand the elements while providing comfortable seating. Teak's natural oils make it ideal for outdoor furniture, as it requires no chemical treatments and ages to a beautiful silver-gray patina.

The joinery uses traditional boat-building techniques that allow for wood movement while maintaining structural integrity. All fasteners are stainless steel to prevent rust stains.

The bench features a comfortable curved seat and backrest, with drainage channels to prevent water pooling. It's the perfect addition to any garden, patio, or deck.`,
    category: 'outdoor',
    difficulty: 'intermediate',
    estimatedTime: '15 hours',
    materials: [
      { productId: '4', name: 'Teak Decking Board', quantity: 6 },
      { productId: '8', name: 'Cedar Outdoor Planks', quantity: 2 }
    ],
    tools: ['Table saw', 'Router', 'Drill', 'Clamps', 'Orbital sander'],
    images: [
      { url: '/images/projects/teak-bench-1.jpg', alt: 'Teak outdoor bench' },
      { url: '/images/projects/teak-bench-2.jpg', alt: 'Bench in garden setting' }
    ],
    featured: true,
    createdAt: '2024-02-10',
    author: 'Emily Watson'
  },
  {
    _id: '5',
    title: 'Birdseye Maple Jewelry Box',
    description: 'An exquisite jewelry box featuring rare birdseye maple with custom felt lining and brass hardware.',
    fullDescription: `This jewelry box showcases the unique birdseye figure of maple, where small knots in the wood create patterns that resemble birds' eyes. The project required careful selection and bookmatching of the maple to create symmetrical patterns.

The interior features custom-cut felt lining in multiple compartments for different types of jewelry. Brass hinges and clasp add a touch of luxury, while the small size makes it perfect for travel or bedside use.

Finishing involved multiple thin coats of shellac to enhance the depth of the birdseye figure without obscuring the natural wood character.`,
    category: 'accessories',
    difficulty: 'advanced',
    estimatedTime: '12 hours',
    materials: [
      { productId: '6', name: 'Birdseye Maple Board', quantity: 1 },
      { productId: '3', name: 'Curly Maple Turning Blank', quantity: 1 }
    ],
    tools: ['Table saw', 'Router', 'Chisels', 'Clamps', 'Orbital sander'],
    images: [
      { url: '/images/projects/maple-box-1.jpg', alt: 'Birdseye maple jewelry box' },
      { url: '/images/projects/maple-box-2.jpg', alt: 'Box interior with felt' },
      { url: '/images/projects/maple-box-3.jpg', alt: 'Close-up of birdseye figure' }
    ],
    featured: false,
    createdAt: '2024-02-08',
    author: 'Lisa Park'
  },
  {
    _id: '6',
    title: 'Cherry Wood Coffee Table',
    description: 'A elegant cherry wood coffee table that will darken to a rich reddish-brown over time, developing a beautiful patina.',
    fullDescription: `This coffee table celebrates the aging process of cherry wood, which naturally darkens when exposed to light. The design features tapered legs and a simple, elegant profile that complements any decor style.

The table uses traditional mortise and tenon joinery for strength and longevity. A slight chamfer on all edges softens the appearance and makes the piece more approachable.

Finished with a simple oil finish that will allow the wood to age naturally while providing protection. Over time, this piece will develop a rich patina that tells the story of its use and care.`,
    category: 'furniture',
    difficulty: 'intermediate',
    estimatedTime: '20 hours',
    materials: [
      { productId: '5', name: 'Cherry Wood Planks', quantity: 5 },
      { productId: '2', name: 'White Oak Lumber - 4/4', quantity: 2 }
    ],
    tools: ['Table saw', 'Router', 'Chisels', 'Clamps', 'Planer'],
    images: [
      { url: '/images/projects/cherry-table-1.jpg', alt: 'Cherry wood coffee table' },
      { url: '/images/projects/cherry-table-2.jpg', alt: 'Table in living room' }
    ],
    featured: true,
    createdAt: '2024-02-12',
    author: 'Robert Kim'
  }
];
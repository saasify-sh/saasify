import React, { PureComponent } from 'react'

import ReactBackgroundSlideshow from 'react-background-slideshow'

import image1 from 'assets/login/1.jpg'
import image2 from 'assets/login/2.jpg'
import image3 from 'assets/login/3.jpg'
import image4 from 'assets/login/4.jpg'
import image5 from 'assets/login/5.jpg'
import image6 from 'assets/login/6.jpg'

export class BackgroundSlideshow extends PureComponent {
  render() {
    return (
      <ReactBackgroundSlideshow
        images={[image1, image2, image3, image4, image5, image6]}
        {...this.props}
      />
    )
  }
}

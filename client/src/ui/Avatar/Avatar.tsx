import React, { FC } from 'react';

import './Avatar.scss';

type Props = {
  image: string;
}

const Avatar: FC<Props> = props => {
  const { image } = props;

  return (
    <div className="avatar">
      <img className="avatar__image" src={image} />
    </div>
  )
}

export { Avatar };

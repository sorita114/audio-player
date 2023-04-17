import {useRef} from 'react';
import type {FC, MouseEvent} from 'react';
import imagePlay from '../assets/images/ic-small-fill-play-gray.png';
import imageStop from '../assets/images/ic-small-line-stop-gray.png';
import { PLAY_STATUS } from 'src/@type';
import formatTime from 'src/@utils/time-format';
import type { PlayerProp } from 'src/music/index';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

type Props = {
  player: PlayerProp,
  onChangeAudio: (value: PlayerProp) => void,
  onChangeCurrentTime: (value: number) => void,
}

const Player: FC<Props> = ({player, onChangeAudio, onChangeCurrentTime}) => {
  const $progressBar = useRef<HTMLDivElement>(null);

  const handleAudioStatus = () => {
    if(player) {
      onChangeAudio({
        ...player,
        status: player.status === PLAY_STATUS.PLAY ? PLAY_STATUS.PAUSED : PLAY_STATUS.PLAY
      });
    }
  };

  const handleClickProgressBar = (e: MouseEvent<HTMLDivElement>) => {
    if($progressBar && $progressBar.current) {
      const {pageX} = e;
      const pos = pageX - $progressBar.current.offsetLeft;
      const percent = pos / $progressBar.current.offsetWidth;

      onChangeCurrentTime(percent * player.totalTitme);
    }
  };

  return (
    <div css={styled}>
      <button style={{width: 25}} onClick={handleAudioStatus}>
        {player?.status === PLAY_STATUS.PLAY ? (
          <img src={imageStop} width="20px" height="25px" alt="stop button"/>
        ) : (
          <img src={imagePlay} width="20px" height="25px" alt="play button"/>
        )}
      </button>
      <span style={{width: '30%'}}>{player.title}</span>
      <section style={{width: '70%'}}>
        <div className="play-time" style={{width: '33%'}}>
          <span>{formatTime(player.currentTime)}</span>
        </div>
        <div className="progress-bar" onClick={handleClickProgressBar} ref={$progressBar}>
          <span className="tick" style={{width: `${player.currentTime / player.totalTitme * 100}%`}} />
        </div>
        <div className="total-time" style={{width: '33%'}}>

          <span>{formatTime(player.totalTitme)}</span>
        </div>
      </section>
    </div>
  );
}

const styled = css({
  textAlign: 'left',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flex: '0 0 100%',
  gap: 30,
  '> section': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    '.play-time': {
      textAlign: 'right',
    },
    '.progress-bar': {
      height: 30,
      width: '100%',
      backgroundColor: '#fff',
      borderRadius: 15,
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer',
      '.tick': {
        height: 30,
        backgroundColor: '#3297a8',
        position: 'absolute',
        left: 0,
        top: 0
      }
    }
  }
})

export default Player;
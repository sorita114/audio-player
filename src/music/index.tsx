import {useEffect, useState, useRef, useCallback, } from 'react';
import type {FC, SyntheticEvent} from 'react';
import { Music, ResultMusicList } from 'src/@dto/response';
import useMusic from 'src/@hooks/use-music';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import imagePlay from '../assets/images/ic-small-fill-play-gray.png';
import imageStop from '../assets/images/ic-small-line-stop-gray.png';
import dateFormat from 'src/@utils/date-format';
import { PLAY_STATUS } from 'src/@type';
import Player from './player';

export type PlayerProp = {
  id: string;
  src: string;
  title: string;
  totalTitme: number;
  currentTime: number;
  status?: PLAY_STATUS
}

let playPromise: Promise<void>;

const MusicList: FC = () => {
  const [list, setList] = useState<ResultMusicList>();
  const {muiscList, getMusicUrl, newMusic} = useMusic();
  const [player, setPlayer] = useState<PlayerProp | undefined>();
  
  const $audio = useRef<HTMLAudioElement>(null);

  const tagMoods = (moods: string[]): string => {
    return moods.reduce((acc, cur) => acc + `#${cur} `, '');
  }

  const handlePlayMusic = (item: Music) => {
    const isNew =  player?.id !== item.id;
    
    if(isNew) {
      getMusicUrl(item);
    } else {
      setPlayer({
        ...player,
        status: player?.status === PLAY_STATUS.PLAY ? PLAY_STATUS.PAUSED : PLAY_STATUS.PLAY
      });
    }
  };

  const handleEnded = useCallback(() => {
    if(player) {
      setPlayer(undefined);
    }
  }, [player]);

  const handleLoadedMetadata = (e: SyntheticEvent<HTMLAudioElement>) => {
    const duration = (e.target as HTMLAudioElement).duration;
    if(player) {
      setPlayer({
        ...player,
        totalTitme: Number(duration.toFixed(0))
      });
    }
  };

  const handelUpdateTime = (e: SyntheticEvent<HTMLAudioElement>) => {
    const currentTime = (e.target as HTMLAudioElement).currentTime;
    if(player) {
      setPlayer({
        ...player,
        currentTime: Number(currentTime.toFixed(0))
      })
    }
  };

  const handleChangeCurrentTime = (currentTime: number) => {
    if($audio && $audio.current) {
      $audio.current.currentTime = currentTime;
    }
  };

  useEffect(() => {
    if($audio && $audio.current) {
      $audio.current.loop = false;
    }
  }, [$audio]);

  useEffect(() => {
    if(muiscList) {
      setList(() => muiscList.data);
    }
  }, [muiscList, setList]);


  useEffect(() => {
    if(newMusic) {
      setPlayer({
        ...newMusic,
        status: PLAY_STATUS.PLAY
      });

      $audio.current?.load();
    }
  }, [newMusic, setPlayer]);

  useEffect(() => {
    if(player && $audio && $audio.current) {
      switch(player.status) {
        case PLAY_STATUS.PLAY:
          playPromise = $audio.current.play();
          break;
        case PLAY_STATUS.PAUSED:
          playPromise?.then(() => $audio.current?.pause());
          break;
        default:
          playPromise?.then(() => $audio.current?.pause());
          break;
      }
    } else {
      playPromise?.then(() => $audio.current?.pause());
    }
  }, [player, $audio])

  return (
    <section css={styled}>
      <audio 
        ref={$audio} 
        autoPlay={true} 
        preload="auto" 
        onEnded={handleEnded}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handelUpdateTime}
      >
        <source src={player?.src} />
      </audio>
      <section>
        <h1>플레이리스트</h1>
        <ul>
          {list && list.items.map((item, index) => (
            <li key={`${item.id}_${index}`}>
              <button onClick={() => handlePlayMusic(item)}>
                {item.id === player?.id && player?.status === PLAY_STATUS.PLAY ? (
                  <img src={imageStop} width="20px" height="25px" alt="stop button"/>
                ) : (
                  <img src={imagePlay} width="20px" height="25px" alt="play button"/>
                )}
              </button>
              <p style={{width: '50%'}}>
                <span>{item.title}</span>
              </p>
              <p style={{width: '30%'}}>
                {item.moods && (
                  <span>{tagMoods(item.moods)}</span>
                )}
              </p>
              <p style={{width: '10%'}}>
                <span>{item.genre}</span>
              </p>
              <p style={{width: '10%'}}>
                <span>{dateFormat(item.public_date)}</span>
              </p>
            </li>
          ))}
        </ul>
      </section>
      {player && (
        <footer>
          <Player 
            player={player} 
            onChangeAudio={(data) => setPlayer(data)} 
            onChangeCurrentTime={handleChangeCurrentTime}
          />
        </footer>
      )}
    </section>
  )
}

const styled = css({  
  '> section': {
    padding: '0 50px',
    marginBottom: 70,
  },
  h1: {
    textAlign: 'left',
  },
  button: {
    cursor: 'pointer',
    backgroundColor: 'inherit',
    border: 0
  },
  ul: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    li: {
      textAlign: 'left',
      display: 'flex',
      alignItems: 'center',
      height: 30,
      gap: 10,
      border: '1px solid #ddd',
      borderRadius: 5,
      marginBottom: 10,
      padding: '5px 10px',
      ':last-child': {
        marginBottom: 0
      },
      ':hover': {
        backgroundColor: '#ddd'
      },
      '> button': {
        display: 'flex',
        alignItems: 'center',
        height: 30,
        width: 25
      }
    }
  },
  footer: {
    height: 50,
    position: 'sticky',
    bottom: 0,
    backgroundColor: '#ddd',
    padding: '10px 50px',
    display: 'flex',
    alignItems: 'center',
  }
})

export default MusicList;
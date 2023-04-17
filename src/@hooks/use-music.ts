import {useState} from 'react';
import { useQuery, useMutation } from "react-query";
import axios from "axios";
import { Music, ResultMusicList, ResultMusicURL } from "src/@dto/response";
import { PlayerProp } from 'src/music';

const REQUEST_DOMAIN = 'http://localhost:8000';

const useMusic = () => {
  const [newMusic, setNewMusic] = useState<PlayerProp>();

  const {data: muiscList, isLoading: loadingList} = useQuery('/musics', () => {
    return axios.get<ResultMusicList>(`${REQUEST_DOMAIN}/musics`);
  });

  const {mutate: getMusicUrl, isLoading: loadingUrl} = useMutation(`/musics:id`, (item: Music) => {
    return axios.get<ResultMusicURL>(`${REQUEST_DOMAIN}/musics/${item.id}`);
  }, {
    onSuccess: ({data}, value) => {
      setNewMusic({
        ...value,
        src: data.url,
        totalTitme: 0,
        currentTime: 0,
      });
    }
  });

  return {
    muiscList,
    loadingList,
    loadingUrl,
    newMusic,
    getMusicUrl,
  };
}

export default useMusic;
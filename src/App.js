import { useEffect, useState } from 'react'
import Tmdb from './Reducer/Tmdb'
import MovieRow from './Components/MovieRow/MovieRow'
import FeatureMovie from './Components/FeatureMovie/FeatureMovie'
import Header from './Components/Header/Header'

import './App.css'

const PagePrincipal = () => {

  const [movieList, setMovieList] = useState([])
  const [featureData, setFeatureData] = useState(null)
  const [blackHeader, setBlackHeader] = useState(false)

  useEffect(() => {
    const loadAll = async () => {
      //pegando a lista total
      let list = await Tmdb.getHomeList()
      setMovieList(list)

      //pegando o feature
      let originals = list.filter(item => item.slug === 'originals')
      const randomChosen = Math.floor(Math.random() * (originals[0].items.results.length -1))
      let chosen = originals[0].items.results[randomChosen]
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv')
      setFeatureData(chosenInfo)
    }
    loadAll();
  }, [])

  useEffect(() => {
    const scrollListener = () => {
      if(window.scrollY > 10) {
        setBlackHeader(true)
      } else {
        setBlackHeader(false)
      }
    }

      window.addEventListener('scroll', scrollListener)
      return() => {
        window.removeEventListener('scroll', scrollListener)
      }
  }, [])

  return (
    <div className='page'>

    <Header black={blackHeader} />

      {featureData &&
       <FeatureMovie item={featureData}/>
      }

      <section className='lists'>
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>
        <footer>

          Feito com amor pela Mika <br></br>
          Direitos de imagem para Netflix <br></br>
          Dados coletados do site themoviedb.org
        </footer>

        {movieList.length <= 0 &&
        <div className='loading'>
          <img src='https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif' alt='' />
        </div>
        }

    </div>
  )
}

export default PagePrincipal
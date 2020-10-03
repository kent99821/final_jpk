import React,{Component} from 'react'
import '../../assets/globel.css'
import jp1 from '../../assets/01.jpg'
import jp2 from '../../assets/02.jpg'
import jp3 from '../../assets/03.jpg'
import jp4 from '../../assets/04.jpg'
import jp5 from '../../assets/05.jpg'
import wechat from '../../assets/wechat.jpg'
import laoshi from '../../assets/laoshi.jpg'
import book from '../../assets/dianlu.jpg'
import {
  HomeFilled,FileTextFilled,WechatFilled
  } from '@ant-design/icons';
import { Carousel,Popover,message,Button,Card} from 'antd';
import Axios from 'axios'
const content=(
<img src={wechat} alt=""/>
    
)
const teacher=(
        <img src={laoshi} alt=""/>
)
const bk=(
  <img src={book} alt=""/>
)
export default class Main extends Component{
  constructor(props){
  super(props);
  this.state={
    title:"",
    destin:"",
    gongao:[],
    _notice:""
  }
  }
componentDidMount()
{
  this.getData();
}

 getData(){
    const that=this;
    Axios.get('http://118.178.125.139:8060/guest/introduce/find')
    .then(function(response){
       that.setState({
         title:response.data.extended.Introduce.introduce_title,
         destin:response.data.extended.Introduce.introduce_destination
       })
    })
    .catch(function(error){
      message.info('获取课程简介失败...')
    })
    Axios.get('http://118.178.125.139:8060/guest/notice/findAll?page=0&size=10')
    .then(function(response){
        that.setState({
         gongao:response.data.extended.notices.content
        })
        for(var i=0;i<that.state.gongao.length;i++)
      {
// eslint-disable-next-line
that.state._notice+="<li><h2>"+that.state.gongao[i].notice_title+"<h2></li>"+"<p class='noticeD'>"+that.state.gongao[i].notice_destination+"</p>" 
      }
        document.getElementById("oul").innerHTML=that.state._notice
    })
    .catch(function(error){
      message.info('获取公告失败...')
    }) 
    
  
  }
    render(){
        return(
      <div className='area'>
    <div className='area1'>
    <Carousel autoplay dotPosition='bottom'>
    <div className='area1'>
   <img src={jp1} className='jp' alt=""/>
    </div>
    <div  className='area1'>
    <img src={jp2} className='jp' alt=""/>
    </div>
    <div  className='area1'>
    <img src={jp3} className='jp' alt=""/>
    </div >
    <div className='area1'>
    <img src={jp4} className='jp' alt=""/>
    </div>
    <div className='area1'>
    <img src={jp5} className='jp' alt=""/>
    </div>
  </Carousel>
    </div>
    <div className="area2">
  <div className="area3">
  <Card title="老师简介">
  {teacher}
         <h1>姓名:张三 性别:男 </h1>
         <h2>学历:工学博士 职称:教授</h2>
      <p>近十年来教授的主要课程有大学物理，数字电路，电路分析北京大学双学士，清华大学硕士研究生
北京大学辩论协会副会长
北京八校经济学院辩论赛主席
第一届北京高校演讲比赛冠军
第二届北京高校演讲比赛冠军
北京大学甘肃社会实践团团长
物理奥林匹克竞赛全省第一名
“北大之锋”辩论赛物理学院领队
第六届“华罗庚”金杯数学竞赛全国一等奖
</p>
  </Card>
  </div>
  <div className='area4'>
<Card title={this.state.title}>
{bk}
<p>{this.state.destin}</p>
</Card>
  </div>
  <div className="area5">
  <Card title="公告">
   <ul id='oul'>
   </ul>
  </Card>
  </div>
    </div>
        <div className='area6'>    
            <h2 className='footer'>快速通道</h2> 
             <p className="footer">
             <Button ghost icon={<HomeFilled/>} type="dashed" ><a href='http://ehall.gdou.edu.cn/new/index.html' className="alink">服务大厅</a></Button>
               &nbsp;
               <Button ghost icon={<FileTextFilled/>} type="dashed" className='Btn'><a href='https://www.gdou.edu.cn/kstd/xxgk1.htm'className="alink">信息公开</a></Button>
               &nbsp;
               <Button ghost icon={<WechatFilled/>} type="dashed"  ><Popover content={content}>微信</Popover></Button>
             
             </p>
        </div>
    </div>
        )
    }
}
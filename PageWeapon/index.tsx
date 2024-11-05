import React, {FC, useEffect, useState, useCallback} from 'react';
import style from './PageWeapon.module.scss'
import {Layout} from "../Layout";
import Image from "next/image";
import {useConfigContext} from "../../context/config";
import {useLangContext} from "../../context/lang";
import {Name} from "../Name";
import {usePageContentContext} from "../../context/pageContent";
import {IWeapon} from "../../interface/Weapon";
import {SkinDesign2} from "../SkinDesign2";
import {rangData} from "../../helper/rangData";
import {Btn} from "../Btn/Btn";
import {getRangClass} from "../../helper/getRangClass";
import {IComponentPagePageSkin} from "../../interface/Page";
import {PageContent} from "../PageContent";

export const PageWeapon: FC<IWeapon> = (props) => {
    const {DATA_HOST} = useConfigContext();
    const {spread_control} = useLangContext();
    const {isMobile, refLink, skinSlug} = usePageContentContext();
    const {secret, consumer_goods, military_quality,
        industrial_quality, prohibited, classified, showMore, rarity} = useLangContext();
    const {
        attributes: {name, image, spread_control_img, skins, content }
    } = props;
    const skinsQty = isMobile ? 6 : 15;
    const initWeapons = skins.data.map(i=>{
        return {...i, operRang: rangData(i.attributes.rang)[1], show: false};
    });
    const [skinsList, setSkinsList] = useState(initWeapons);
    const [showMoreBtn, setShowMoreBtn] = useState(true);
    const [activeCat, setActiveCat] = useState([secret, consumer_goods, military_quality, industrial_quality, prohibited, classified]);
    const [collapseFilter, setCollapseFilter] = useState(true);
    const [collapseSpreadControl, setCollapseSpreadControl] = useState(true);
    const secretQty = initWeapons.filter(i=>i.operRang === secret).length;
    const classifiedQty = initWeapons.filter(i=>i.operRang === classified).length;
    const prohibitedQty = initWeapons.filter(i=>i.operRang === prohibited).length;
    const militaryQty = initWeapons.filter(i=>i.operRang === military_quality).length;
    const industrialQty = initWeapons.filter(i=>i.operRang === industrial_quality).length;
    const consumerQty = initWeapons.filter(i=>i.operRang === consumer_goods).length;
    const sidebarRangData:[string, number][] = [
        [secret, secretQty],
        [classified, classifiedQty],
        [prohibited, prohibitedQty],
        [military_quality, militaryQty],
        [industrial_quality, industrialQty],
        [consumer_goods, consumerQty]
    ];
    const showMoreWeapons = useCallback((list:IComponentPagePageSkin[]) => {
        const qtyShowSkins = list.reduce((akk, i)=>{
            if(i.show){
                akk+=1;
            }
            return akk;
        }, 0);
        const newQtyShowSkins = qtyShowSkins + Number(skinsQty);
        const newList = list.map((i, iter)=>{
            if(iter+1 <= newQtyShowSkins){
                i.show = true;
            }
            return i;
        });
        if(newQtyShowSkins >=newList.length){
            setShowMoreBtn(false);
        }
        setSkinsList(newList);
    }, [skinsQty]);

    const filterCategory = (cat:string) => {
        const newActiveCat = activeCat.includes(cat) ?
            activeCat.filter(i=>i!==cat) :
            [...activeCat, cat];
        setActiveCat(newActiveCat);

        const filterList = initWeapons.filter(i=>newActiveCat.includes(i.operRang));
        showMoreWeapons(filterList);
    }
    useEffect(() => {
        showMoreWeapons(skins.data);
    }, [skins, showMoreWeapons]);

    return (
        <>
            <Layout>
                <div className={style.weapon_page}>
                <div className={style.weapon__sidebar}>
                    <div className={style.weapon__card}>
                            {image.data &&
                            <Image src={DATA_HOST + image.data.attributes.url} alt={name} width={300} height={200} />
                            }
                        {name}
                    </div>
                    {spread_control_img.data &&
                    <div
                        className={[style.weapon__spread_control, collapseSpreadControl ? style.collapse : ''].join(' ')}>
                        <Image src={DATA_HOST + spread_control_img.data.attributes.url} alt={name} width={300}
                               height={300} className={style.collapseData}/>
                        <span className={style.weapon__spread_control__name}
                              onClick={() => setCollapseSpreadControl(!collapseSpreadControl)}>
                            {spread_control}
                            <span className={style.weapon__ico}>
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
<path d="M15 19L20 22L25 19" stroke="currentColor" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round"/>
</svg>
                            </span>
                        </span>
                    </div>
                    }
                    <div className={[style.weapon__filter, collapseFilter ? style.collapse: ''].join(' ')}>
                        <div className={style.weapon__filter__heading} onClick={()=>setCollapseFilter(!collapseFilter)}>

                            <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M5 8H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M9 15H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <span className={style.weapon__filter__heading__txt}>
                            {rarity}
                            </span>
                            <span className={style.weapon__ico}>
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
<path d="M15 19L20 22L25 19" stroke="currentColor" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round"/>
</svg>
                            </span>
                        </div>
                        <div className={[style.weapon__filter__list, style.collapseData].join(' ')}>

                        {
                            sidebarRangData.map((i, iter)=>{
                                const activeCl = activeCat.includes(i[0]) ? 'active' : '';
                                return (
                                    <div className={style.weapon__filter__item} key={iter}>
                            <span className={style.weapon__filter__item__check} onClick={()=>filterCategory(i[0])}>
                                {activeCat.includes(i[0]) &&
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                                    <path d="M14 19.6667L18.2162 24L26 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                }
                            </span>
                                        <span className={[style.weapon__filter__item__rang, style[getRangClass(i[0])]].join(' ')}></span>
                                        <span className={[style.weapon__filter__item__name, style[activeCl]].join(' ')}>{i[0]}</span>
                                        <span className={[style.weapon__filter__item__qty, style[activeCl]].join(' ')}>{i[1]}</span>
                                    </div>
                                )
                            })
                        }
                        </div>

                        </div>
                    </div>
                    <div className={style.weapon__content}>
                        {
                            skinsList.length>0 &&
                                <>
                            <div className={style.weapon__skins}>
                                {skinsList.map(i=>{
                                    if(!i.show) return;

                                    const {name, printName, image, rang, slug} = i.attributes;
                                    return (
                                        <SkinDesign2 image={image} slug={slug} name={name} rang={rangData(rang)[0]} printName={printName} key={i.id}/>
                                        )
                            })}
                            </div>
                                    <div className={style.weapon__actions}>
                                        {
                                            showMoreBtn &&
                                            <Btn variant={"btn_2"} handle={()=>showMoreWeapons(skinsList)}>
                                                {showMore}
                                            </Btn>
                                        }
                                    </div>
                            </>
                        }

                        <div className={style.before_content}></div>
                        <PageContent pageContent={content}/>
                        </div>
                    </div>
            </Layout>
        </>
    );
};


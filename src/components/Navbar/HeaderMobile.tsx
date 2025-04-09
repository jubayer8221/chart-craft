import React from 'react'

import {SIDENAV_ITEMS} from '@/constants'
import {SideNavItem} from '@/types'

import {motion, useCycle} from 'framer-motion'
import { IoMenuSharp } from "react-icons/io5";

type MenuItemWithSubMenuProps = {
  item: SideNavItem;
  toggleOpen: () => void;
}

const HeaderMobile = () => {

  // const [isOpen, toggleOpen] = useCycle(false, true);
  return (
    <motion.nav>
      {/* <motion.div>
        <motion.ul>
          {
            SIDENAV_ITEMS.map((item, index)=>{
              // const isLastItem = idx === SIDENAV_ITEMS.length - 1;
              return(
                <div key={index}>
                  {item.submenu ? (
                    <IoMenuSharp item={item} toggleOpen={toggleOpen} />
                  ) : (
                    <MenuItem>
                      <button>

                      </button>
                    </MenuItem>
                  )}
                </div>
              )
            })
          }
        </motion.ul>
      </motion.div> */}
    </motion.nav>
  )
}

export default HeaderMobile;